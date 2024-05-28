import express from 'express';
import { Validator } from '../support/validator';
import { Server as WebSocketServer, WebSocket } from 'ws';

export class TriggerCntrl {
    public router: express.Router = express.Router();
    public static wss: WebSocketServer;

    /**
    * The method constructor. Constructor
    *
    */
    public constructor(wss: WebSocketServer) {
        TriggerCntrl.setRouterMiddleWare(this.router);
        TriggerCntrl.wss = wss;
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/trigger-alert')
            .get(Validator.validate, TriggerCntrl.triggerAlert);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static triggerAlert(req: express.Request, res: express.Response): void {
            console.log('triggerAlert -', req.url);

            // console.log("bhbwd");
            // console.log(TriggerCntrl.wss);
            TriggerCntrl.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    // console.log("Hi");
                    client.send("alertMessage");
                }
            });
        
            // console.log("Hello");
            res.status(200).send('Alert triggered');
    }

}

// export let triggerCntrl = new TriggerCntrl()