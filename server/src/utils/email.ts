import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { redis } from '../redis';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Email {
  static apiKey: string;

  constructor(private configService: ConfigService) {}

  async sendMail(email: string, userId: string) {
    sgMail.setApiKey(this.configService.get<string>('SG_KEY'));

    const msg = {
      to: email, // Change to your recipient
      from: 'prinarteh@gmail.com', // Change to your verified sender
      subject: 'Confirm Your Email',
      text: 'Welcome to Voting App. Your number application for voting',
      html: `Kindly confirm your email by clicking on the link. <a href="${this.confirmEmailLink(
        userId,
      )}">Confirm</a>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async confirmEmailLink(userId: string) {
    const id = uuid();
    await redis.set(id, userId, 'ex', 60 * 60 * 15);
    return `${process.env.BACKEND_HOST}/user/confirm/${id}`;
  }
}
