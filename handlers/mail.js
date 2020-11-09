const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");

const emailOptions = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  }

const transport = nodemailer.createTransport(sgTransport(emailOptions));

// const transport = nodemailer.createTransport(sgTransport(options){
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });

// make sure template can be connected so it renders in the sent mail
const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};

exports.sendForgotPassword = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "jeff.jak13@gmail.com",
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};

exports.sendRequest = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "jeff.jak13@gmail.com",
        to: options.mentor.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}

exports.sendAccept = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "jeff.jak13@gmail.com",
        to: [`${options.mentor.email}`, `${options.mentee.email}`],
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}

exports.sendDecline = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "jeff.jak13@gmail.com",
        to: options.mentee.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}

// TEST to make sure mail is working
// transport.sendMail({
//     from: "Jeff Jakinovich <jeff.jakinovich@gmail.com>",
//     to: "randy@example.com",
//     subject: "Just trying things out!",
//     html: "Hey I <strong>love</strong> you",
//     text: "Hey I **love** you."
// })