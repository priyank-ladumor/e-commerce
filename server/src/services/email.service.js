import { findUserByEmail } from "../services/user.service.js"
import nodemailer from "nodemailer";


export const sendEmail = async (items) => {
    const email = items.email;
    console.log(email, "email");
    var findUser = await findUserByEmail(email)

    if (findUser) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            debug: true,
            logger: true,
            secure: true,
            secureConnection: false,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: true
            }
        });

        var mailOptions = {
            from: process.env.MY_EMAIL,
            to: findUser.email,
            subject: items.subject,
            html: items.email_template
            // text: 
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent to ' + findUser.email);
                // return ('Email sent to ' + findUser.email)
            }
        });

    } else {
        throw new Error({ status: "user does not exit" })
    }
}