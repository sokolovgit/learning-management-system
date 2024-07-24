import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mailer.host'),
      port: this.configService.get<number>('mailer.port'),
      secure: this.configService.get<boolean>('mailer.secure'),
      tls: {
        rejectUnauthorized: this.configService.get<boolean>(
          'mailer.tls.rejectUnauthorized',
        ),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('mailer.from'),
      to,
      subject,
      text,
    });
  }
}
