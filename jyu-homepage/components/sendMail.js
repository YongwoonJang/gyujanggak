const nodemailer = require('nodemailer');

module.exports = sendMail;

async function sendMail (server, mail_id, user_id, mail_code, mailAddr, path, author, contents) {

        //Test to mail 
        let testAccount = nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: server,
            port: 465,
            secure: true,
            auth: {
                user: mail_id,
                pass: mail_code,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Gyujanggak" <' + mailAddr + '>', // sender address
            to: user_id, // list of receivers
            subject: author + " wrote at " + path, // Subject line
            text: "", // plain text body
            html: contents, // html body
        });

        console.log("Message sent: %s", info.messageId);

};