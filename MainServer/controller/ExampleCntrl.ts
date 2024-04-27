import express from 'express';
import { Validator } from '../support/validator';

class ExampleCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        ExampleCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/logs')
            .get(Validator.validate, ExampleCntrl.example);
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

}

export let exampleCntrl = new ExampleCntrl()