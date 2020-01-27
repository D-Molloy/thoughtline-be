"use strict";
const nodeMailer = require("nodemailer");

module.exports = function(email, username) {
  let body_html;

  body_html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Thoughtline Username</title>
    </head>
    <body
      style="text-align: center;font-family: Verdana, Geneva, Tahoma, sans-serif;"
    >
      <div style="margin-top: 2rem;">
        <img
          src="https://thoughtline.s3-us-west-2.amazonaws.com/thoughtline-logo-primary.png"
          alt="Thoughtline logo"
          style="width: 150px;"
        />
      </div>
      <div>
        <h1>A Message from <span style="color: #ee5f3f;">Thoughtline</span></h1>
        <h4 style="font-weight: 100;">
          A request was made for a username reminder.
        </h4>
        <h4 style="font-weight: 100;">
          Your username is:
        </h4>
        <h2 style="color: #ee5f3f;">${username}</h2>
        <br />
  
        <a href="https://www.thoughtline.net/">
          <button
            style="position: relative;width: 250px;height: 50px;font-size: 20px;cursor: pointer;border: 3px solid #e8745a;background-color: lightskyblue;color: #ee5f3f;border-radius: 9px;"
          >
            Login to Thoughtline
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
    subject: `Username request`, // Subject line
    text: `Your username is ${username}`, // plain text body
    html: body_html // html body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });
};
