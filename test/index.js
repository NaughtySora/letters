'use strict';

const nodemailer = require('nodemailer');
const config = require('./config.js');
const path = require('node:path');
const { Template } = require('../main');

const templates = new Template({ throwSanitize: true })
  .load([path.resolve(__dirname, "./reset-password"),]);

const EMAIL = 'someguy@gmail.com';

const main = async () => {
  const mailer = nodemailer.createTransport(config.dev);
  await mailer.verify();
  const html = templates.html("reset-password", { name: "Sora" });
  try {
    const info = await mailer.sendMail({ to: EMAIL, from: EMAIL, html, });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

main();