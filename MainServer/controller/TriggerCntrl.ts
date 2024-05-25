import express from 'express';
import { Validator } from '../support/validator';
import { Server as WebSocketServer, WebSocket } from 'ws';

export class TriggerCntrl {
    public router: express.Router = express.Router();
    private static wss: WebSocketServer;

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
            .post(Validator.validate, TriggerCntrl.triggerAlert);
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

            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("alertMessage");
                }
            });
        
            res.status(200).send('Alert triggered');
    }

}

// export let triggerCntrl = new TriggerCntrl()