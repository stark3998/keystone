import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { keys } from '../support/keys';
import { GunShotDetector } from '../external/gunShotDetector';
import { WebSocketService } from './webSocketService';
import { WebSocketServer } from 'ws';
import { Readable } from 'stream';
import path from 'path';

export class TelegramService {

    // public static wss: WebSocketServer;

    // public constructor(wss: WebSocketServer) {
    //     TelegramService.wss = wss;
    // }

    public static bot = new TelegramBot(keys.telegram, { polling: true });

    private static users: { [chat_id: number]: string } = {
        7017630724: 'e4:d3:7a:49:bb:4a',
        1161057898: 'e6:8a:39:51:87:f1',
    };
    
    public static telegramBot(wss: WebSocketServer) {
        console.log(wss.clients);

        TelegramService.bot.on('polling_error', (msg) => {
            // console.log(msg);
        });

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

        TelegramService.bot.on('contact', (msg) => {
            const chatId = msg.chat.id;
            const phoneNumber = msg.contact!.phone_number;
            TelegramService.bot.sendMessage(chatId, `Thank you! Your phone number is ${phoneNumber}.`);
            console.log(chatId);
        });

        var userState: 'waitingForReport' | 'waitingForDescription' = 'waitingForReport';

        TelegramService.bot.on('message', (msg) => {
            // wss.clients.forEach((client) => {
            //     // console.log("hi");
            //     // console.log(client.readyState);
            //     // console.log(client.readyState, client.readyState === WebSocket.OPEN);
            //     // if (client.readyState === WebSocket.OPEN) {
            //         client.send("alertMessage");
            //     // }
            // });
            // console.log(msg);
            if (msg.voice) {
                const fileId = msg.voice.file_id;
                TelegramService.bot.getFileLink(fileId).then(link => {
                    console.log(link);
                    GunShotDetector.getGunShotData(link).then(res => {
                        console.log(res.data);
                        if (res.data.Detected === 'Gun Shot') {
                            TelegramService.bot.sendMessage(msg.chat.id, 'Gunshot detected! System admin and first responders notified.');
                            wss.clients.forEach((client) => {
                                client.send(`${this.users[msg.chat.id]}`);
                            });
                        } else {
                            TelegramService.bot.sendMessage(msg.chat.id, `No emergency detected, We recognized ${res.data.Detected}`);
                        }
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
            else {
                // console.log('No voice message detected.');

                const chatId = msg.chat.id;
                const messageText = msg.text;

                if(messageText === '/report'){
                    userState = 'waitingForDescription';
                    TelegramService.bot.sendMessage(chatId, 'Please describe the emergency.');
                }

                if (userState === 'waitingForReport') {
                    if (messageText === '/report') {
                        userState = 'waitingForDescription';
                        TelegramService.bot.sendMessage(chatId, 'Please describe the emergency.');
                    } else {
                        TelegramService.bot.sendMessage(chatId, 'No emergency detected. If you want to report an emergency, please type /report.');
                    }
                } else if (userState === 'waitingForDescription') {
                    TelegramService.bot.sendMessage(chatId, 'Thank you for reporting the emergency. Please await further instructions.');
                    userState = 'waitingForReport';
                    wss.clients.forEach((client) => {
                        client.send(`${this.users[chatId]}`);
                    });
                }
            }

        });
    }

    public static sendMessage(chatid: string, image: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const chatId = parseInt(chatid);
            // var imagePath = '';
            // console.log(image)
            // Convert base64 string to buffer
            // const buffer = Buffer.from(image, 'base64');
            // console.log(buffer);

            // Convert buffer to ReadableStream
            // const stream = new Readable();
            // stream.push(buffer);
            // stream.push(null); // Indicates the end of the stream
            // console.log(stream);
            // if(chatId == 7017630724){
            //     imagePath = 'assets/VaishPath.jpeg';
            // }
            // else{
            //     imagePath = 'assets/JatinPath.jpeg';
            // }
            // const tempFilePath = path.join(__dirname, '', 'temp_image.jpg');

            // Write buffer data to the temporary file
            fs.writeFileSync(`assets/${chatId}.png`, image.split(';base64,').pop()!, {encoding: 'base64'});
            // resolve();
            TelegramService.bot.sendPhoto(chatId, fs.createReadStream(`assets/${chatId}.png`), { caption: 'Please follow this path!' })
                .then(res => {
                    fs.unlinkSync(`assets/${chatId}.png`);
                    resolve()})
                .catch(err => {console.log(err); reject()});
        });
    }
}
