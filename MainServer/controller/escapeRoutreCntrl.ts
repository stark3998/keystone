import express from 'express';
import { Validator } from '../support/validator';
import { Astar, aStar, myNode } from '../escapeRouteProcessor/A*';

class EscapeRouteCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        EscapeRouteCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/route')
            .get(Validator.validate, EscapeRouteCntrl.escapeRoute1);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static escapeRoute1(req: express.Request, res: express.Response): void {
            console.log('escape -', req.url);
            // var path: myNode[] = []
            var choice: number = Number(req.query.choice)
            var startNodex = Number(req.query.startx)
            var startNodey = Number(req.query.starty)
            var goalNodex = Number(req.query.goalx)
            var goalNodey = Number(req.query.goaly)

            console.log(choice, startNodex, startNodey, goalNodex, goalNodey);

            EscapeRouteCntrl.configAstar(req, res, new myNode(startNodex, startNodey), new myNode(goalNodex, goalNodey), Astar.maze(choice))
    }

    public static configAstar(req: express.Request, res: express.Response, startmyNode: myNode, goalmyNode: myNode, maze: number[][]){
        Astar.runAStar(startmyNode, goalmyNode, maze)
                    .then(resp => {
                        // let myMaze = maze
                        maze[startmyNode.x][startmyNode.y] = 2;
                        maze[goalmyNode.x][goalmyNode.y] = 9;
                        res.status(200).send({"maze": maze, "path": resp});
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).send({"maze": "", "path": ""});
                    });
    }

}

export let escapeRouteCntrl = new EscapeRouteCntrl()