import { SendMailOptions } from 'nodemailer'

export interface IMail {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
  attachments?: SendMailOptions["attachments"];
};

export interface IGenericEmailTemplate {
  title: string;
  message?: string;
  textBtn?: string;
  urlBtn?: string;
};
