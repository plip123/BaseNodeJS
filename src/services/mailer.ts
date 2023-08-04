import nodemailer from 'nodemailer';
import config from 'config';
import { IMail } from '@/types';
import Logger from '@/utils/pino';

export default class Mailer {
  private static instance: Mailer;
  private transporter: nodemailer.Transporter;

  private constructor() {}

  /// Create instance for mail service
  static getInstance() {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }
    return Mailer.instance;
  };

  // Get Transporter
  getTransporter() {
    return this.transporter;
  };
  
  /// Create Connection
  async createConnection() {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('mail.host'),
      port: config.get<number>('mail.port'),
      secure: config.get<string>('mail.tls') === 'yes' ? true : false,
      auth: {
        user: config.get<string>('mail.username'),
        pass: config.get<string>('mail.password'),
      },
    });
  };

  /// Send Mail
  async send(
    requestId: string | number | string[],
    options: IMail
  ) {
    return await this.transporter
      .sendMail({ 
        from: process.env.SMTP_SENDER ?? options.from,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })
      .then((data) => {
        Logger.info(`${requestId} - Mail sent successfully!`);
        Logger.info(`${requestId} - [MailResponse]=${data.response} [MessageID]=${data.messageId}`);

        if (process.env.NODE_ENV === 'development') {
          Logger.info(`${requestId} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
              data
          )}`);
        }
        return data;
      })
      .catch((error) => {
        Logger.error(`ERROR: ${requestId} - Sent failed with error: ${error.message}`);
      });
  };

  /// Verify Mailer Connection
  async verifyConnection() {
    return this.transporter.verify(function (error, success) {
      if (error) {
        Logger.error(error.message);
      } else {
        Logger.info('Server is ready to take our messages');
      }
    });
  };
}