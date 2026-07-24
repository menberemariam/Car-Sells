import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { SignUpDto, SignInDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dtos/auth.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, firstName, lastName } = signUpDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roles: [UserRole.BUYER],
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
    });

    await this.usersRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationToken,
    );

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Find user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = this.generateTokens(user.id, user.email);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersRepository.findOne({
      where: { verificationToken: verifyEmailDto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.verificationTokenExpiry < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await this.usersRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { email: forgotPasswordDto.email } });

    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If email exists, password reset link will be sent' };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;

    await this.usersRepository.save(user);

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

    return { message: 'If email exists, password reset link will be sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { passwordResetToken: resetPasswordDto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (user.passwordResetTokenExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;

    await this.usersRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    return { accessToken, refreshToken };
  }
}
