import { generateToken } from "../middlewares/jwtProvider";


const sendVerifyMail = async (link, name, email, token) => {
    try {
        
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

            const source = fs.readFileSync('.././nodejs/public/email.html', 'utf-8').toString();
            const template = handlebars.compile(source)
            const replacement = {
                link: `http://localhost:3000/user/reset-password/${finduser._id}/${token}`,
                name: finduser.firstname
            }
            const htmltosend = template(replacement)

            var mailOptions = {
                from: process.env.MY_EMAIL,
                to: finduser.email,
                subject: 'Forgot your password',
                html: htmltosend
                // text: 
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent to ' + finduser.email);
                    res.json('Email sent to ' + finduser.email)
                }
            });

        } else {
            res.send({ status: "user does not exit" })
        }

    } catch (err) {
        res.status(400).json({ "msg": err });
    }
}