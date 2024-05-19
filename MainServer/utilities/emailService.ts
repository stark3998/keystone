const nodemailer = require('nodemailer');

export class EmailService {

    public static sendEmail(){
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient@example.com',
            subject: 'Subject of your email',
            html: '<p>Email content goes here.</p>'
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
}
