// const nodemailer = require('nodemailer');
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

export class TelegramService {

    public static bot = new TelegramBot('7117452758:AAGkQIlgho7xLfH9UOGEjh2WWP-V7rCojnY', { polling: true });
    public static telegramBot() {

        

        // Command to start the process
        TelegramService.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            TelegramService.bot.sendMessage(chatId, 'Welcome! Please share your phone number with me.', {
                reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{
                    text: "Share Phone Number",
                    request_contact: true
                    }]
                ]
                }
            });
            });
        
            // Handle the phone number shared by the user
            TelegramService.bot.on('contact', (msg) => {
            const chatId = msg.chat.id;
            const phoneNumber = msg.contact!.phone_number;
        
            TelegramService.bot.sendMessage(chatId, `Thank you! Your phone number is ${phoneNumber}.`);
            console.log(chatId);
            });
        
            // Listener for any text message
            TelegramService.bot.on('message', (msg) => {
                const chatId = msg.chat.id;
                // bot.sendMessage(chatId, 'Received your message');

                const imagePath = 'assets/path.png';
  
                // Send the image
                TelegramService.bot.sendPhoto(chatId, fs.createReadStream(imagePath), { caption: 'Please follow this path!' });
                console.log(chatId);
            });

    }

    public static sendMessage(chatid: string): Promise<void> {

        return new Promise((resolve, reject) => {
            // Listener for any text message
            const chatId = parseInt(chatid);
            // bot.sendMessage(chatId, 'Received your message');

            const imagePath = 'assets/path.png';

            // Send the image
            TelegramService.bot.sendPhoto(chatId, fs.createReadStream(imagePath), { caption: 'Please follow this path!' }).then(res => resolve()).catch(err => reject());
        }) 
    }


    // public static sendEmail(){
    //     // Create a transporter object using SMTP transport
    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'your-email@gmail.com',
    //             pass: 'your-password'
    //         }
    //     });

    //     const mailOptions = {
    //         from: 'your-email@gmail.com',
    //         to: 'recipient@example.com',
    //         subject: 'Subject of your email',
    //         html: '<p>Email content goes here.</p>'
    //     };

    //     transporter.sendMail(mailOptions, (error: any, info: any) => {
    //         if (error) {
    //             console.error('Error sending email:', error);
    //         } else {
    //             console.log('Email sent:', info.response);
    //         }
    //     });
    // }
}
