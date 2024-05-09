import express from 'express';
import { Validator } from '../support/validator';
import { LogGenerator } from '../utilities/logGenerator';
import { FloorPlan } from '../external/floorPlan';

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
        router.route('/floorplan')
            .get(Validator.validate, LogGeneratorCntrl.getFloorPlan);
    }

    public static getWifiLogs(req: express.Request, res: express.Response): void {
        console.log('getWifiLogs -', req.url);
        
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked'
        });

        var generateAndStreamData = () => {
            LogGenerator.getNetworkLogs().then(resp => {
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

    public static getFloorPlan(req: express.Request, res: express.Response): void {
        console.log('getFloorPlan -', req.url);
        FloorPlan.getFloorPlan().then(ress => 
            res.status(200).send(ress)
        )
        .catch(err => res.status(500).send(err));
    }

}

export let logGeneratorCntrl = new LogGeneratorCntrl()