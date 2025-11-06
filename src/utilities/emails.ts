import * as nodemailer from 'nodemailer';
import fs from 'fs';

import { emailEnv } from '../config/emails';
import { getMsAppAccessToken } from './emailAuth';
import templates from '../constants/email_templates';
import {
  EmailTemplateHash,
  UserDocument,
  EmailTemplateGenerator,
} from '../types';
import { AppNames } from '../config/app_urls';
import User from '../models/User';
import Mail = require('nodemailer/lib/mailer');

type TemplateName = keyof typeof templates;

async function resolveTransporter(): Promise<Mail> {
  if (process.env.NODE_ENV === 'test') {
    const account = await new Promise<nodemailer.TestAccount>(
      (resolve, reject) =>
        nodemailer.createTestAccount((err, acc) =>
          err ? reject(err) : resolve(acc),
        ),
    );
    fs.writeFileSync(
      'ethereal_creds.json',
      JSON.stringify({ user: account.user, pass: account.pass }),
    );
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    });
  }

  const method = emailEnv.method();
  const username = emailEnv.username();
  const host = emailEnv.host();
  const port = emailEnv.port();
  const secure = emailEnv.secure();

  if (method === 'oauth2_cc') {
    const accessToken = await getMsAppAccessToken();
    // console.log('Email config:', {
    //   host,
    //   port,
    //   secure,
    //   username,
    //   tokenLength: accessToken.length,
    //   tokenPrefix: accessToken.substring(0, 20) + '...',
    // });
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        type: 'OAuth2',
        user: username,
        accessToken,
        expires: Date.now() + 3600000, // 1 hour from now
      },
    });
  }

  if (method === 'password') {
    const password = emailEnv.password();
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: username, pass: password },
    });
  }

  throw new Error(`Unsupported EMAIL_AUTH_METHOD: ${method}`);
}

export async function sendEmailSMTP(
  recipient: string,
  host: string,
  template: TemplateName,
  token: string | null,
  userObj: UserDocument,
  appName: string,
): Promise<string> {
  const smtpTransport = await resolveTransporter();
  try {
    await smtpTransport.verify();
    console.log('Server is ready to take our messages');
  } catch (err) {
    console.error('Verification failed', err);
  }
  const fromUser = emailEnv.username();

  const build: EmailTemplateGenerator | undefined = templates[template];
  if (!build) throw new Error(`Unknown email template: ${String(template)}`);

  const msg: EmailTemplateHash = build(
    recipient,
    host,
    token,
    userObj,
    fromUser,
    appName,
  );

  await new Promise<void>((resolve, reject) =>
    smtpTransport.sendMail(msg, (err, info) => {
      if (err) {
        console.error('SendMail error details:', err);
        reject(err);
      } else {
        console.log('SendMail success info:', info);
        resolve();
      }
    }),
  );

  const okMsg = `Email (${template}) sent successfully to ${recipient} from ${fromUser}`;
  return okMsg;
}

export async function sendEmailsToAdmins(
  host: string,
  appName: AppNames.Enc | AppNames.Vmt,
  template: TemplateName,
  relatedUser: UserDocument,
): Promise<void> {
  try {
    const adminCrit =
      appName === AppNames.Enc
        ? { isTrashed: false, accountType: 'A', email: { $ne: null } }
        : { isTrashed: false, isAdmin: true, email: { $ne: null } };

    const admins: UserDocument[] = await User.find(adminCrit)
      .lean()
      .exec();
    if (!Array.isArray(admins)) return;

    for (const user of admins) {
      if (user.email) {
        void sendEmailSMTP(
          user.email,
          host,
          template,
          null,
          relatedUser,
          appName,
        );
      }
    }
  } catch (err) {
    console.error(`Error sendEmailsToAdmins: ${err}`);
  }
}
