import express from 'express';
import { Validator } from '../support/validator';
import { UserLocation } from '../external/userLocation';
import { UserLocationProcessor } from '../utilities/userLocationProcessor';
import { Floorplan } from '../utilities/floorplan';
import { dbFloorRowResponse, PlanRow } from '../support/interfaces';

import { Server as WebSocketServer, WebSocket } from 'ws';

export class LocationProcessorCntrl {
    public router: express.Router = express.Router();
    public static wss: WebSocketServer;
    /**
    * The method constructor. Constructor
    *
    */
    public constructor(wss: WebSocketServer) {
        LocationProcessorCntrl.setRouterMiddleWare(this.router);
        LocationProcessorCntrl.wss = wss;
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/userlocation')
            .get(Validator.validate, LocationProcessorCntrl.getUserLocation);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static getUserLocation(req: express.Request, res: express.Response): void {
        console.log('getUserLocation -', req.url);
        var floorname: string = req.query.name ? req.query.name.toString() : 'DBH 6th Floor';
        Floorplan.getFloorPlanByName(floorname).then((floorPlanData: dbFloorRowResponse) => {

            // console.log("calling");
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked'
            });
            UserLocation.getUserLocation(floorname, LocationProcessorCntrl.processUserLocation, res, floorPlanData.payload!).then(ress => {
                res.end();
            })
            .catch(err => {
                res.write(JSON.stringify(err) + '\n\n');
                res.end();
            });
        })
        .catch(err => {
            res.status(err.code).send(err.error)
        })
    }

    public static processUserLocation(parsed: any, res: express.Response, floorPlanData: any) {
        var userLocation = UserLocationProcessor.processUserLocation(parsed, floorPlanData);
        LocationProcessorCntrl.wss.clients.forEach((client) => {
            client.send(JSON.stringify(userLocation) + '\n\n');
        });
        res.write(JSON.stringify(userLocation) + '\n\n');
    }

}

// export let locationProcessorCntrl = new LocationProcessorCntrl()