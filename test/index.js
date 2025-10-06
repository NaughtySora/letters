'use strict';

const nodemailer = require('nodemailer');
const config = require('./config.js');
const path = require('node:path');
const { Template } = require('../main');
const { describe, it } = require('node:test');
const assert = require('node:assert');

const reset = path.resolve(__dirname, "./letters/reset-password");
const empty = path.resolve(__dirname, "./letters/empty");
const noCSS = path.resolve(__dirname, "./letters/noCSS");
const plainHTML = path.resolve(__dirname, "./letters/plainHTML");
const useJS = path.resolve(__dirname, "./letters/useJS");

// example with nodemailer
// change config.dev to config.prod, add config.prod real SMTP service
// don't forget docker compose up
const send = async (html) => {
  const EMAIL = 'someguy@gmail.com';
  const mailer = nodemailer.createTransport(config.dev);
  await mailer.verify();
  try {
    await mailer.sendMail({ to: EMAIL, from: EMAIL, html, });
  } catch (error) {
    console.error(error);
  }
};

describe("Template", () => {
  it("load", () => {
    const template = new Template()
      .load([reset])
      .load([noCSS, plainHTML]);

    assert.throws(() => {
      template.load([empty]);
    }, { message: "Can't find index.html file" })
  });

  it("html", () => {
    const template = new Template()
      .load([reset])
      .load([noCSS, plainHTML, useJS]);
    const html = {
      reset: template.html("reset-password", { name: "Name" }),
      noCSS: template.html("noCSS", { something: [1, 2, 3, 4] }),
      plainHTML: template.html("plainHTML", { test: 42, string: "string", obj: {}, weird: Atomics }),
      useJS: template.html("useJS", { array: ["test", "this", "out", "!"] }),
      injection: template.html("reset-password", {
        name: "<div onclick='localstorage.getItem('token')'>injected?</div>"
      }),
    };
    assert.ok(html.reset.includes("<p>Name</p>"));
    assert.ok(html.noCSS.includes("<style></style>"));
    assert.ok(html.noCSS.includes("1,2,3,4"));
    assert.ok(!html.plainHTML.includes("42"));
    assert.ok(!html.plainHTML.includes("string"));
    assert.ok(!html.plainHTML.includes(({}).toString()));
    assert.ok(!html.plainHTML.includes(Atomics.toString()));
    assert.ok(html.useJS.includes("true"));
    assert.ok(html.useJS.includes("test this out !"));
    assert.ok(html.injection.includes("injected?"));
    assert.ok(!html.injection.includes("<div onclick='localstorage.getItem('token')'>injected?</div>"));
  });

  it("throw injection attempt", () => {
    const template = new Template({ throwSanitize: true });
    template.load([reset]);
    assert.throws(() => {
      template.html(
        "reset-password",
        { name: "<div onclick='localstorage.getItem('token')'>injected?</div>" }
      );
    }, { message: "HTML Injection, input: <div onclick='localstorage.getItem('token')'>injected?</div>" });

    const html = template.html(
      "reset-password",
      { name: "Hello <3" }
    );
    // should not throw, escaping the "<"
    assert.ok(html.includes("<p>Hello &lt;3</p>"));
    assert.ok(!html.includes("<p>Hello <3</p>"));
  });
});