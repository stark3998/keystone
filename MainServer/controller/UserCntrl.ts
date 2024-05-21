import express from 'express';
import { Validator } from '../support/validator';
import { UserService } from '../utilities/userService';
import { dbUsersResponse } from '../support/interfaces';

class UserCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        UserCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/')
            .get(Validator.validate, UserCntrl.getUsers);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */

    public static getUsers(req: express.Request, res: express.Response): void {
        console.log('getUsers -', req.url);
        UserService.getAllUsers().then((users: dbUsersResponse) => res.status(users.code).send(users))
        .catch((err: dbUsersResponse) => res.status(err.code).send(err))
}

}

export let userCntrl = new UserCntrl()