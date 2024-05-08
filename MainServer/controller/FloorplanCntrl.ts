import express from 'express';
import { Validator } from '../support/validator';
import { getDatabaseInstance } from '../service';

interface PlanRow {
    name: string;
    description: string;
    data: {
        blocked: { x: number; y: number }[];
        wifi: { x: number; y: number }[];
        audio: { x: number; y: number }[];
        access: { x: number; y: number }[];
    };
    thumbnail: string;
    width: number;
    height: number;
}

class FloorplanCntrl {
    public router: express.Router = express.Router();

    /**
    * The method constructor. Constructor
    *
    */
    public constructor() {
        FloorplanCntrl.setRouterMiddleWare(this.router);
    }

    /**
    * The method setRouterMiddleWare. 
    *
    * @param router of type express.Router
    * @returns void
    */
    public static setRouterMiddleWare(router: express.Router): void {
        router.route('/getAllPlans')
            .get(Validator.validate, FloorplanCntrl.getAllPlans);

        router.route('/getPlanByName')
            .get(Validator.validate, FloorplanCntrl.getPlanByName);

        router.route('/savePlan')
            .post(Validator.validate, FloorplanCntrl.savePlan);
    }

    /**
    * The method getStates. undefined
    *
    * @param req of type express.Request
    * @param res of type express.Response
    * @returns void
    */
    public static getAllPlans(req: express.Request, res: express.Response): void {
        console.log('getAllPlans -', req.url);

        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get all plans from the database
        const selectQuery = `SELECT * FROM plans`;
        db.all(selectQuery, [], (err: any, rows: PlanRow[]) => {
            if (err) {
                res.status(500).json({ message: "Error fetching plans" });
            } else {
                res.status(200).json({ plans: rows });
            }
        });

    }

    public static getPlanByName(req: express.Request, res: express.Response): void {
        console.log('getPlanByName -', req.url);

        const { name } = req.query;

        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get plan from database by name
        const selectQuery = `SELECT * FROM plans WHERE name = ?`;
        db.get(selectQuery, [name], function (err, row: PlanRow) {
            if (err) {
                res.status(500).json({ message: "Error fetching plan" });
            } else {
                if (row) {
                    // Deserialize data from bytes to JSON
                    //const data = JSON.parse(row.data);
                    res.status(200).json({ plan: row});
                } else {
                    res.status(404).json({ message: "Plan not found" });
                }
            }
        });
    }

    public static savePlan(req: express.Request, res: express.Response): void {
        console.log('savePlan -', req.url);

        const { name, description, data, thumbnail, width, height } = req.body;

        // Connect to the SQLite database
        const db = getDatabaseInstance();

        console.log('db - ', db);

        // Save plan to database
        const insertQuery = `INSERT INTO plans (name, description, data, thumbnail, width, height) VALUES (?, ?, ?, ?, ?, ?)`;

        // Convert data object to JSON string
        const serializedData = JSON.stringify(data);

        db.run(insertQuery, [name, description, serializedData, thumbnail, width, height], function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Error saving plan" });
            } else {
                console.log('Plan saved successfully');
                res.status(200).json({ message: "Plan saved successfully" });
            }
        });
    }

}

export let floorplanCntrl = new FloorplanCntrl()