"use strict";
const nodeMailer = require("nodemailer");

module.exports = function(email, token) {
  let body_html;

  body_html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Thoughtline Invite</title>
    </head>
    <body
      style="text-align: center;font-family: Verdana, Geneva, Tahoma, sans-serif;"
    >
      <div style="margin-top: 50px;">
        <img
          src="https://thoughtline.s3-us-west-2.amazonaws.com/thoughtline-logo-primary.png"
          alt="Thoughtline logo"
          style="width: 150px;"
        />
      </div>
      <div>
        <h1>A Message from <span style="color: #ee5f3f;">Thoughtline</span></h1>
        <h4
          style="font-weight: 100; font-size: 20px; margin-top:10px; margin-bottom:10px"
        >
          A request was made to reset your password.
        </h4>
        <h4
          style="font-weight: 100; font-size: 20px; margin-top:10px; margin-bottom:10px"
        >
          Click on the button below to reset your password...
        </h4>
        <br />
        <a href="https://www.thoughtline.net/password?t=${token}&email=${email}">
          <button
            style="position: relative;width: 250px;height: 50px;font-size: 20px;cursor: pointer;border: 3px solid #e8745a;background-color: lightskyblue;color: #ee5f3f;border-radius: 9px;"
          >
            Reset Password
          </button>
        </a>
      </div>
    </body>
  </html>
  `;

  // send grid smtp sending.
  let transporter = nodeMailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDGRIDUSERNAME,
      pass: process.env.SENDGRIDKEY
    }
  });
  let mailOptions = {
    from: '"Friends at Thoughtline" <thoughtline2019@gmail.com>', // sender address
    to: email, // list of receivers
    subject: `password reset`, // Subject line
    text: `password reset.`, // plain text body
    html: body_html // html body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });
};
