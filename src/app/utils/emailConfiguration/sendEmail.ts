import nodemailer from 'nodemailer';

const sendEmail = async (receiver: any, sender: any, subject: any, message: any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: true,
            auth: {
                user: `${process.env.MAIL_USERNAME}`,
                pass: `${process.env.MAIL_PASSWORD}`,
            },
        });

        const info = await transporter.sendMail({
            from: `"TechZaint 👻" <${sender}>`,
            to: receiver,
            subject: subject,
            text: message,
            html: `<div>${message}</div>`,
        });

        // console.log("Message sent: %s", info.messageId);
        return "Mail sent successfully.";
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw error;
    }
};

export default sendEmail;


/**
 * Following this way do it in the controller
 * 
 * try {
        const receiver = "reciver mail";
        const sender = "sender mail";
        const subject = "Nodemailer Message";
        const message = "Hello world? <h2>Sm.Munna Making Mail</h2>";

        const result = await sendEmail(receiver, sender, subject, message);
        res.send({
            message: result,
        });
    } catch (error) {
        res.status(500).send("Error sending email: " + error);
    }
 * 
 * 
 * */ 