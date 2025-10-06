'use strict';

const fs = require("node:fs");

module.exports = [
  { filename: "hello.txt", content: "Hello world!", },
  { filename: "buffer.txt", content: Buffer.from("Hello world!", "utf8"), },
  { filename: "report.pdf", path: "/absolute/path/to/report.pdf", },
  { path: "/absolute/path/to/image.png", },
  { filename: "notes.txt", content: fs.createReadStream("./notes.txt"), },
  { filename: "data.bin", content: Buffer.from("deadbeef", "hex"), contentType: "application/octet-stream", },
  { filename: "license.txt", href: "https://raw.githubusercontent.com/nodemailer/nodemailer/master/LICENSE", },
  {
    filename: "photo.jpg",
    content: "/9j/4AAQSkZJRgABAQAAAQABAAD…", // truncated
    encoding: "base64",
  },
  { path: "data:text/plain;base64,SGVsbG8gd29ybGQ=", },
  {
    raw: ["Content-Type: text/plain; charset=utf-8", 'Content-Disposition: attachment; filename="greeting.txt"', "", "Hello world!"].join("\r\n"),
  },
];