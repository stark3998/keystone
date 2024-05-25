import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { keys } from '../support/keys';
import { GunShotDetector } from '../external/gunShotDetector';
import { WebSocketService } from './webSocketService';

export class TelegramService {
    public static bot = new TelegramBot(keys.telegram, { polling: true });

    public static telegramBot() {

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
            // console.log(msg);
            if (msg.voice) {
                const fileId = msg.voice.file_id;
                TelegramService.bot.getFileLink(fileId).then(link => {
                    console.log(link);
                    GunShotDetector.getGunShotData(link).then(res => {
                        console.log(res.data);
                        if (res.data.Detected === 'Gun Shot') {
                            TelegramService.bot.sendMessage(msg.chat.id, 'Gunshot detected! Please report the emergency.');
                        } else {
                            TelegramService.bot.sendMessage(msg.chat.id, `No emergency detected, We recognized ${res.data.Detected}`);
                        }
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
            else {
                console.log('No voice message detected.');

                const chatId = msg.chat.id;
                const messageText = msg.text;

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
                }
            }

        });
    }

    public static sendMessage(chatid: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const chatId = parseInt(chatid);
            const imagePath = 'assets/path.png';
            TelegramService.bot.sendPhoto(chatId, fs.createReadStream(imagePath), { caption: 'Please follow this path!' })
                .then(res => resolve())
                .catch(err => reject());
        });
    }
}
