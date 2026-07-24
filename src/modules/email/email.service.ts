import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_PORT') === 465,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, firstName: string, token: string) {
    const verificationLink = `${this.configService.get('APP_URL')}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Car Marketplace, ${firstName}!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationLink}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const resetLink = `${this.configService.get('APP_URL')}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetLink}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Welcome to Car Marketplace!',
      html: `
        <h1>Welcome to Car Marketplace!</h1>
        <p>Hi ${firstName},</p>
        <p>Your account has been created successfully.</p>
        <p>Start buying or selling cars today!</p>
      `,
    });
  }

  async sendListingApprovedEmail(email: string, listingTitle: string) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Your Listing Has Been Approved',
      html: `
        <h1>Listing Approved!</h1>
        <p>Great news! Your listing "${listingTitle}" has been approved and is now live.</p>
      `,
    });
  }

  async sendListingRejectedEmail(email: string, listingTitle: string, reason: string) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Your Listing Has Been Rejected',
      html: `
        <h1>Listing Rejected</h1>
        <p>Unfortunately, your listing "${listingTitle}" was rejected for the following reason:</p>
        <p><strong>${reason}</strong></p>
      `,
    });
  }

  async sendOfferNotificationEmail(email: string, buyerName: string, offeredPrice: number) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'New Offer Received',
      html: `
        <h1>New Offer!</h1>
        <p>You have received a new offer from ${buyerName} for $${offeredPrice}</p>
      `,
    });
  }
}
