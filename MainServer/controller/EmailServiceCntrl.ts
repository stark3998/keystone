import express from 'express';
import { Validator } from '../support/validator';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramService } from '../utilities/telegramService';
import { UserService } from '../utilities/userService';

class EmailServiceCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        EmailServiceCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/sendPath')
            .post(Validator.validate, EmailServiceCntrl.sendMessage);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static example(req: express.Request, res: express.Response): void {
            console.log('example -', req.url);
    }

    public static sendMessage(req: express.Request, res: express.Response): void {
        console.log('sendMessage -', req.url);
        console.log("Request: ", req.body);
        UserService.getAllUsers().then(ress => {
            ress.payload!.primary_users.forEach(user => {
                TelegramService.sendMessage(user.chat_id).catch(err => res.status(500).send({error: "Cannot send message"}));
                console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, chat_id: ${user.chat_id}`);
            });
            res.status(200).send("Messages sent successfully!");

        })
        .catch(err => res.status(err.status).send(err));
    }

    

}

export let emailServiceCntrl = new EmailServiceCntrl()