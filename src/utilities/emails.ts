import * as nodemailer from 'nodemailer';
import { getEmailAuth } from '../config/emails';
import * as emailTemplates from '../constants/email_templates';
import { EmailTemplateHash, UserDocument } from '../types';
import { AppNames } from '../config/app_urls';
import User from '../models/User';

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

  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: username,
      pass: password,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-angle-bracket-type-assertion
  const msg: EmailTemplateHash = (<any>emailTemplates)[template](
    recipient,
    host,
    token,
    userObj,
    username,
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
            let msg = `Email (${template}) sent successfully to ${recipient} from ${username}`;
            console.log('email success: ', msg);
            resolve(msg);
          }
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
