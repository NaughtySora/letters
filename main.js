'use strict';

const nodemailer = require('nodemailer');
const config = require('./config.js');
require("./framework.js");

//! mailhog UI
// http://localhost:8025/

const letter = () => ({
  from: "naughtysora@proton.me",
  to: "naughtysora@proton.me",
  subject: "Simple mail template",
  text: "Hello plain text message!",
  html: "<b>html text message</b>",
});

const amp = () => ({
  from: "naughtysora@proton.me",
  to: "naughtysora@proton.me",
  subject: "AMP testing",
  text: "For clients with plaintext support only",
  html: "<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>",
  amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
        <p>GIF (requires "amp-anim" script in header):<br/>
          <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
      </body>
    </html>`,
});

const html = (props) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>p{color: red;}</style>
</head>
<body>
    <p>${name}</p>
</body>
</html>
`;

const main = async () => {
  // const mailer = nodemailer.createTransport(config.dev);
  // await mailer.verify();
  // try {
  //   const info = await mailer.sendMail({
  //     to: "naughtysora@proton.me",
  //     from: "naughtysora@proton.me",
  //     html: html(clean("Hello <3")),
  //   });
  //   console.log({ info });
  // } catch (error) {
  //   console.error(error);
  // }
};

main();


