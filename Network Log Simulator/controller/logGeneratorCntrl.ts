import express from 'express';
import { Validator } from '../support/validator';
import { LogGenerator } from '../utilities/logGenerator';

class LogGeneratorCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        LogGeneratorCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/logs')
            .get(Validator.validate, LogGeneratorCntrl.getWifiLogs);

        // router.route('/states/districts')
        //     .get(Validator.validate, LocationCntrlr.getDistricts);

    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static getWifiLogs(req: express.Request, res: express.Response): void {
            console.log('getWifiLogs -', req.url);

            // LogGenerator.generateWifiAccessPointLogs().then(resp => {
            //     res.status(resp.statusCode).send(resp.log);
            // })
            // .catch(resp => {
            //     res.status(resp.statusCode).send(resp.error);
            // });

        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked'
        });

        var generateAndStreamData = () => {
            LogGenerator.generateWifiAccessPointLogs().then(resp => {
                // Stream data to the client
                res.write(JSON.stringify(resp.log) + '\n\n');
            })
            .catch(resp => {
                // Stream data to the client
                res.write(JSON.stringify(resp.error) + '\n\n');
            });
        }

        const intervalId = setInterval(generateAndStreamData, 1000);

        // End the stream after 5 seconds (for demonstration)
        setTimeout(() => {
            clearInterval(intervalId);
            res.end();
        }, 50000); // End the stream after 5 seconds (for demonstration)

    }

}

export let logGeneratorCntrl = new LogGeneratorCntrl()