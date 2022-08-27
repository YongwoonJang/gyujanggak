import nodemailer from 'nodemailer';

export default async (author, contents) => {

        //Test to mail 
        let testAccount = nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_KEY,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Gyujanggak" <' + process.env.MAIL_ADDR + '>', // sender address
            to: process.env.USER_ID, // list of receivers
            subject: author + "wrote in work experience", // Subject line
            text: "", // plain text body
            html: contents, // html body
        });

        console.log("Message sent: %s", info.messageId);

};