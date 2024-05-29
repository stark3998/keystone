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
        var floorname: string = req.query.name ? req.query.name.toString() : 'RH1';
        FloorPlan.getFloorPlan(floorname).then(floorPlanData => {

            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked'
            });

            var logs = LogGenerator.getPrimaryUsersLocation(floorPlanData.plan)

            let currentIndex = 0;
  
        const intervalIdLog = setInterval(() => {
            if (currentIndex < logs.length) {
            // // Send the current data item
            // console.log('Sending data:', logs[currentIndex]);
            
            // Perform your send action here, e.g., send over WebSocket
            // ws.send(data[currentIndex]);

            res.write(JSON.stringify(logs[currentIndex]) + '\n\n');

            currentIndex++;
            } else {
            // Clear the interval once all items have been sent
            clearInterval(intervalIdLog);
            // console.log('All data sent');
            }
        }, 700); // Interval set to 1 second (1000 milliseconds)
  
            // LogGenerator.initializeUsers(floorPlanData.plan);
            
    
            var generateAndStreamData = () => {
                LogGenerator.generateWifiAccessPointLogs(floorPlanData.plan).then(resp => {
                    // Stream data to the client
                    res.write(JSON.stringify(resp.log) + '\n\n');

                    // res.on('close', () => {
                    //     clearInterval(intervalId);
                    //     res.end();
                    // });

                })
                .catch(resp => {
                    // Stream data to the client
                    res.write(JSON.stringify(resp.error) + '\n\n');
                });
            }
    
            const intervalId = setInterval(generateAndStreamData, 700);

            res.on('close', () => {
                clearInterval(intervalId);
                res.end();
            });
    
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
        FloorPlan.getFloorPlan('RH1').then(ress => 
            res.status(200).send(ress)
        )
        .catch(err => res.status(500).send(err));
    }

}

export let logGeneratorCntrl = new LogGeneratorCntrl()