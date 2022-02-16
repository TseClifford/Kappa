("use strict");
const express = require("express");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const { restart } = require("nodemon");

module.exports = () => {
  router.post("/", async (req, res) => {
    const { user_name, user_email, user_message } = req.body;
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    try {
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `${user_name} <${user_email}>`, // sender address
        to: "kappadogs@kappa.com", // list of receivers
        subject: "Dog Inquiry", // Subject line
        text: user_message, // plain text body
        html: `<b>${user_message}</b>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      res.status(200).send("message sent");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("fail");
    }
  });

  return router;
};
