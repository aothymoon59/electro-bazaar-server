import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import config from './../config';
import { IEmailOptions } from '../interface/mail.interface';

const sendMail = async (options: IEmailOptions) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: parseInt(config.smtp_port || '587'),
    auth: {
      user: config.smtp_mail,
      pass: config.smtp_password,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, '../mails', template);
  const html: string = await ejs.renderFile(templatePath, data);

  await transporter.sendMail({
    from: config.smtp_mail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
