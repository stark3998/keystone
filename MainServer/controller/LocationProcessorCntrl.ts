import express from 'express';
import { Validator } from '../support/validator';
import { UserLocation } from '../external/userLocation';
import { UserLocationProcessor } from '../utilities/userLocationProcessor';

class LocationProcessorCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        LocationProcessorCntrl.setRouterMiddleWare(this.router);
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
        var floorname: string = req.query.name ? req.query.name.toString() : 'DBH%206th%20Floor';
        UserLocation.getFloorPlan(floorname).then(floorPlanData => {
            console.log("calling");
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked'
            });
            UserLocation.getUserLocation(floorname, LocationProcessorCntrl.processUserLocation, res, floorPlanData.plan).then(ress => {
                res.end();
            })
            .catch(err => {
                res.write(JSON.stringify(err) + '\n\n');
                res.end();
            });
        })
    }

    public static processUserLocation(parsed: any, res: express.Response, floorPlanData: any) {
        // console.log("Parsed Data Chunk: ", parsed);
        var userLocation = UserLocationProcessor.processUserLocation(parsed, floorPlanData);
        res.write(JSON.stringify(userLocation) + '\n\n');
    }

}

export let locationProcessorCntrl = new LocationProcessorCntrl()