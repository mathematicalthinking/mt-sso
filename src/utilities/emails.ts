import * as nodemailer from 'nodemailer';
import { getEmailAuth } from '../config/emails';
import * as emailTemplates from '../constants/email_templates';
import { EmailTemplateHash, UserDocument } from '../types';

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
