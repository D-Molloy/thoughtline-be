"use strict";
const nodeMailer = require("nodemailer");

module.exports = function(req) {
  console.log("in send nodmailer", req.body.email);
  let body_html;
  if (!req.user.firstname) {
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
        <div
          id="title-div"
          style="margin:auto;margin-top: 100px; width:150px; position: relative;"
        >
          <img
            src="${req.user.picture}"
            id="friend-image"
            alt="Friend Image"
            style="width: 125px;"
          />
    
          <img
            id="logo"
            src="https://thoughtline.s3-us-west-2.amazonaws.com/thoughtline-logo-primary.png"
            alt="Thoughtline logo"
            style="width: 100px;
                position: absolute;
                top: -65px;
                right: -65px"
          />
        </div>
        <div id="invite" style="margin: auto;">
          <h2 style="margin-bottom:0px">
            <span class="highlight" style="color: #ee5f3f;"
              >${req.user.username}</span
            >
            wants you to join
            <span
              class="logo-text highlight"
              style="font-style: italic;color: #ee5f3f;"
              >Thoughtline</span
            >
            so they can send you their thoughts!
          </h2>
          <br />
          <h3 style="margin-top:0px">
            Click the below to create a free account and view
            <span class="highlight" style="color: #ee5f3f;"
              >${req.user.username}'s</span
            >
            thoughts about you:
          </h3>
          <a href="https://www.thoughtline.net/">
            <button
              style="position: relative;width: 300px;height: 50px;font-size: 20px;cursor: pointer;border: 3px solid #e8745a;background-color: lightskyblue;color: #ee5f3f;border-radius: 9px;"
            >
              Create a Thoughtline account
            </button>
          </a>
        </div>
      </body>
    </html>    
  `;
  }
  if (req.user.firstname) {
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
        <div
          id="title-div"
          style="margin:auto;margin-top: 100px; width:150px; position: relative;"
        >
          <!-- <img src="${req.user.picture}" id="friend-image" style="width: 150px;" /> -->
          <img
            src="https://thoughtline.s3.amazonaws.com/5c6216635d60bfa718a21694.jpeg"
            id="friend-image"
            style="width: 125px;"
          />
    
          <img
            id="logo"
            src="https://thoughtline.s3-us-west-2.amazonaws.com/thoughtline-logo-primary.png"
            alt="Thoughtline logo"
            style="width: 100px;
            position: absolute;
            top: -65px;
            right: -65px"
          />
        </div>
        <div id="invite" style="margin: auto;">
          <h2 style="margin-bottom:0px">
            <span class="highlight" style="color: #ee5f3f;"
              >${req.user.firstname} ${req.user.lastname}</span
            >
            wants you to join
            <span
              class="logo-text highlight"
              style="font-style: italic;color: #ee5f3f;"
              >Thoughtline</span
            >
            so they can send you their thoughts!
          </h2>
          <br />
          <h3 style="margin-top:0px">
            Click the below to create a free account and view
            <span class="highlight" style="color: #ee5f3f;"
              >${req.user.firstname}'s</span
            >
            thoughts about you:
          </h3>
          <a href="https://www.thoughtline.net/">
            <button
              style="position: relative;width: 300px;height: 50px;font-size: 20px;cursor: pointer;border: 3px solid #e8745a;background-color: lightskyblue;color: #ee5f3f;border-radius: 9px;"
            >
              Create a Thoughtline account
            </button>
          </a>
        </div>
      </body>
    </html>
    `;
  }
  // this is for gmail sending, but keeps locking out user
  // let transporter = nodeMailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD,
  //   },
  // });
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
    to: req.body.email, // list of receivers
    subject: `Your friend ${req.user.firstname} ${req.user.lastname} wants to send you a personal thought on Thoughtline!`, // Subject line
    text: `Your friend ${req.user.firstname} ${req.user.lastname} wants to share thoughts with you on Thoughtline.
            Please go to www.thoughtline.net to set up a free account.`, // plain text body
    html: body_html // html body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });
};
