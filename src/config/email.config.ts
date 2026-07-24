import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const getEmailConfig = (configService: ConfigService) => {
  return nodemailer.createTransport({
    host: configService.get('EMAIL_HOST'),
    port: configService.get('EMAIL_PORT'),
    secure: configService.get('EMAIL_PORT') === 465,
    auth: {
      user: configService.get('EMAIL_USER'),
      pass: configService.get('EMAIL_PASSWORD'),
    },
  });
};
