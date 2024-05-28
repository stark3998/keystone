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
        var floorname: string = req.query.name ? req.query.name.toString() : 'DBH%206th%20Floor';
        FloorPlan.getFloorPlan(floorname).then(floorPlanData => {

            // LogGenerator.initializeUsers(floorPlanData.plan);
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked'
            });
    
            var generateAndStreamData = () => {
                LogGenerator.generateWifiAccessPointLogs(floorPlanData.plan).then(resp => {
                    // Stream data to the client
                    res.write(JSON.stringify(resp.log) + '\n\n');

                    res.on('close', () => {
                        clearInterval(intervalId);
                        res.end();
                    });

                })
                .catch(resp => {
                    // Stream data to the client
                    res.write(JSON.stringify(resp.error) + '\n\n');
                });
            }
    
            const intervalId = setInterval(generateAndStreamData, 700);
    
            // End the stream after 5 seconds (for demonstration)
            // setTimeout(() => {
            //     clearInterval(intervalId);
            //     res.end();
            // }, 50000); // End the stream after 5 seconds (for demonstration)

            // this.generateWifiAccessPointLogs(floorPlanData.plan).then(response => {
            //     // console.log('Generated Log:', response.log);
            //     return resolve(response);
            // }).catch(error => {
            //     console.error('Error generating log:', error);
            //     return reject({"statusCode": 500, "log": undefined});
            // });
          })
          .catch(err => {
            res.write(JSON.stringify(err) + '\n\n');
          });
    }

    public static getFloorPlan(req: express.Request, res: express.Response): void {
        console.log('getFloorPlan -', req.url);
        FloorPlan.getFloorPlan('DBH%206th%20Floor').then(ress => 
            res.status(200).send(ress)
        )
        .catch(err => res.status(500).send(err));
    }

}

export let logGeneratorCntrl = new LogGeneratorCntrl()