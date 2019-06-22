const nodemailer = require('nodemailer');
const { getEmailAuth } = require('../config/emails');
const emailTemplates = require('../constants/email_templates');

module.exports.sendEmailSMTP = function(
  recipient,
  host,
  template,
  token = null,
  userObj,
  appName
) {
  console.log(`getEmailAuth() return: ${getEmailAuth(appName).username}`);

  let { username, password } = getEmailAuth(appName);

  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: username,
      pass: password,
    },
  });
  const msg = emailTemplates[template](
    recipient,
    host,
    token,
    userObj,
    username,
    appName
  );
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(msg, err => {
      if (err) {
        let errorMsg = `Error sending email (${template}) to ${recipient} from ${username}: ${err}`;
        console.error(errorMsg);
        console.trace();
        return reject(errorMsg);
      }
      let msg = `Email (${template}) sent successfully to ${recipient} from ${username}`;
      return resolve(msg);
    });
  });
};
