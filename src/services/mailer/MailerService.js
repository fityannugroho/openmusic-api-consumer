const { createTransport } = require('nodemailer');
const config = require('../../utils/config');

class MailerService {
  constructor() {
    this._transporter = createTransport({
      host: config.mailer.host,
      port: config.mailer.port,
      auth: {
        user: config.mailer.address,
        pass: config.mailer.password,
      },
    });
  }

  async sendEmail(targetEmail, mailOptions) {
    return this._transporter.sendMail({
      ...mailOptions,
      from: 'Open Music API',
      to: targetEmail,
    });
  }
}

module.exports = MailerService;
