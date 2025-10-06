'use strict';

module.exports = {
  dev: {
    host: "localhost",
    port: parseInt(process.env.SMTP_DEV_PORT, 10),
    secure: false,
  },
  prod: {},
};
