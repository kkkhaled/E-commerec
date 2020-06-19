const { View } = require("grandjs");
const emailtemplate = View.importJsx("../templates/forgotPass.js");
const nodemailer = require("nodemailer");
class Mailer {
  async sendEmail(vendor) {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: process.env.HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      let template = View.renderToHtml(emailtemplate, { ...vendor });

      const MailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: vendor.email,
        subject: "Forgot Password",
        html: template,
      };
      await transporter.sendMail(MailOptions);
      console.log("email sent done");
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = new Mailer();
/*const sendMail = async (options) => {
  // create transporter "service to send email like gmail"
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};*/
