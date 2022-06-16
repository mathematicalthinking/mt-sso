import * as nodemailer from 'nodemailer';
import { propertyOf } from 'lodash';
import fs from 'fs';

import { getEmailAuth } from '../config/emails';
import * as emailTemplates from '../constants/email_templates';
import { EmailTemplateHash, UserDocument } from '../types';
import { AppNames } from '../config/app_urls';
import User from '../models/User';
import Mail = require('nodemailer/lib/mailer');

const resolveTransporter = function(
  username?: string,
  password?: string,
): Promise<Mail> {
  return new Promise(
    (resolve, reject): void => {
      let isTestEnv = process.env.NODE_ENV === 'test';

      if (isTestEnv) {
        nodemailer.createTestAccount(
          (err, account): void => {
            // create reusable transporter object using the default SMTP transport
            if (err) {
              reject(err);
            } else {
              // in case we want to look at the sent emails
              let fileName = 'ethereal_creds.json';
              fs.writeFile(
                fileName,
                JSON.stringify({
                  user: account.user,
                  pass: account.pass,
                }),
                (err): void => {
                  if (err) {
                    throw err;
                  }
                  console.log('Ethereal creds saved to ', fileName);
                },
              );

              resolve(
                nodemailer.createTransport({
                  host: 'smtp.ethereal.email',
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass, // generated ethereal password
                  },
                }),
              );
            }
          },
        );
      } else {
        if (typeof username !== 'string') {
          return reject(new Error('Missing email username'));
        }

        if (typeof password !== 'string') {
          return reject(new Error('Missing email password'));
        }

        resolve(
          nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: true,
            service: 'Outlook365',
            auth: {
              user: username,
              pass: password,
            },
            tls: {
              maxVersion: 'TLSv1.3',
              minVersion: 'TLSv1.2',
            },
          }),
        );
      }
    },
  );
};

export const sendEmailSMTP = function(
  recipient: string,
  host: string,
  template: string,
  token: string | null = null,
  userObj: UserDocument,
  appName: string,
): Promise<string> {
  console.log(`getEmailAuth() return: ${getEmailAuth(appName).username}`);

  let { username, password } = getEmailAuth(appName);

  return resolveTransporter(username, password).then(
    (smtpTransport): Promise<string> => {
      let mailUsername: string = propertyOf(smtpTransport)('options.auth.user');
      // eslint-disable-next-line @typescript-eslint/no-angle-bracket-type-assertion
      const msg: EmailTemplateHash = (<any>emailTemplates)[template](
        recipient,
        host,
        token,
        userObj,
        mailUsername,
        appName,
      );

      return new Promise(
        (resolve, reject): void => {
          smtpTransport.sendMail(
            msg,
            (err): void => {
              if (err) {
                let errorMsg = `Error sending email (${template}) to ${recipient} from ${username}: ${err}`;
                console.error(errorMsg);
                console.trace();
                reject(errorMsg);
              } else {
                let msg = `Email (${template}) sent successfully to ${recipient} from ${mailUsername}`;
                console.log('email success: ', msg);
                resolve(msg);
              }
            },
          );
        },
      );
    },
  );
};

export const sendEmailsToAdmins = async function(
  host: string,
  appName: AppNames.Enc | AppNames.Vmt,
  template: string,
  relatedUser: UserDocument,
): Promise<void> {
  try {
    let adminCrit =
      appName === AppNames.Enc
        ? {
            isTrashed: false,
            accountType: 'A',
            email: { $ne: null },
          }
        : {
            isTrashed: false,
            isAdmin: true,
            email: { $ne: null },
          };
    let admins: UserDocument[] = await User.find(adminCrit)
      .lean()
      .exec();

    if (!Array.isArray(admins)) {
      return;
    }

    // relatedUser is who the email is about, i.e. if a new user signed up
    admins.forEach(
      (user): void => {
        if (user.email) {
          sendEmailSMTP(user.email, host, template, null, relatedUser, appName);
        }
      },
    );
  } catch (err) {
    console.error(`Error sendEmailsToAdmins: ${err}`);
  }
};
