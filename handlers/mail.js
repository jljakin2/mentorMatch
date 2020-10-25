const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// make sure template can be connected so it renders in the sent mail
const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "Dang That's Delicious <noreply@delicious.com",
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};

// TEST to make sure mail is working
// transport.sendMail({
//     from: "Jeff Jakinovich <jeff.jakinovich@gmail.com>",
//     to: "randy@example.com",
//     subject: "Just trying things out!",
//     html: "Hey I <strong>love</strong> you",
//     text: "Hey I **love** you."
// })