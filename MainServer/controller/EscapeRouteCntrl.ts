import express from 'express';
import { Validator } from '../support/validator';
import { Astar, myNode } from '../escapeRouteProcessor/A*';
import { floorplan } from '../utilities/floorplan';
import { PlanRow } from '../support/interfaces';

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
        router.route('/userRoute')
            .get(Validator.validate, EscapeRouteCntrl.escapeRouteForUser);
        //getting floorplan name, user location x, user location y
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static escapeRouteForUser(req: express.Request, res: express.Response): void {
        console.log('escapeRouteForUser - ', req.url);

        var floorPlanName: String = String(req.query.floorplanName);
        var userX = Number(req.query.userX);
        var userY = Number(req.query.userY);
        var goalNodes: myNode[] = [];

        var maze: number[][] = [];

        floorplan.getPlanByName(floorPlanName, (err: any, row: PlanRow | null) => {
            if (err) {
                console.log("Error fetching plan");
                res.status(500).send({ message : "Error fetching plan"});
            } else {
                if (row) {
                    // console.log("Success fetching plan - ", row);
                    maze = floorplan.transformMaze(row);
                    goalNodes = floorplan.getAccessPoints(row);
                    // console.log(floorPlanName, userX, userY, maze);

                    EscapeRouteCntrl.configAstar(req, res, new myNode(userX, userY), goalNodes, maze)
                } else {
                    console.log("Plan not found");
                    res.status(404).json({ message: "Plan not found" });
                }
            }
        });

    }

    public static configAstar(req: express.Request, res: express.Response, startmyNode: myNode, goalmyNodes: myNode[], maze: number[][]) {
        Astar.runAStar(startmyNode, goalmyNodes, maze)
            .then(resp => {
                // Extract x and y coordinates from each node in the path
                const pathCoordinates = resp.map(node => ({ x: node.x, y: node.y }));

                // let myMaze = maze
                maze[startmyNode.x][startmyNode.y] = 2;
                goalmyNodes.forEach(goalNode => {
                    maze[goalNode.x][goalNode.y] = 9;
                });

                res.status(200).send({ "maze": maze, "path": pathCoordinates });
            })
            .catch(error => {
                console.log(error)
                res.status(500).send({ "maze": "", "path": "" });
            });
    }

}

export let escapeRouteCntrl = new EscapeRouteCntrl()