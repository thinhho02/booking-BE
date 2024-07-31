import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
});

export const sendMail = async (data)=>{
    return await transporter.sendMail({
        from: process.env.NODEMAILER_USER, // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // html body
        headers: {
            'Content-Type': 'text/html'
        },
        replyTo:process.env.NODEMAILER_USER
    });
}

