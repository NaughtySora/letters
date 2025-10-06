'use strict';

const nodemailer = require('nodemailer');
const config = require('./config.js');
const FrameWork = require('./FrameWork.js');

const framework = new FrameWork({ throwSanitize: true })
  .load([resolve(__dirname, "./reset-password"),]);

const EMAIL = 'naughtysora@proton.me';

const main = async () => {
  const mailer = nodemailer.createTransport(config.dev);
  await mailer.verify();
  const html = framework.letter("reset-password", { name: "Sora" });
  try {
    const info = await mailer.sendMail({ to: EMAIL, from: EMAIL, html, });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

main();
