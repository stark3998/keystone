import express from 'express';
import { Validator } from '../support/validator';
import { getDatabaseInstance } from '../service';
import { PlanRow } from '../support/interfaces';
import { floorplan } from '../utilities/floorplan';

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
    router
      .route("/getAllPlans")
      .get(Validator.validate, FloorplanCntrl.getAllPlans);

    router
      .route("/getPlanByName")
      .get(Validator.validate, FloorplanCntrl.getPlanByName);

    router.route("/savePlan").post(Validator.validate, FloorplanCntrl.savePlan);
  }

  /**
   * The method getStates. undefined
   *
   * @param req of type express.Request
   * @param res of type express.Response
   * @returns void
   */
  public static getAllPlans(req: express.Request, res: express.Response): void {
    console.log("getAllPlans -", req.url);

        floorplan.getAllPlans((err: any, rows: PlanRow[] | null) => {
            if (err) {
                res.status(500).json({ message: "Error fetching plan" });
            } else {
                if (rows) {
                    rows = rows.map((row) => {
                      const data = JSON.parse(row.data.toString());
                      return {
                        ...row,
                        data,
                      };
                    });
                    res.status(200).json({ plans: rows });
                } else {
                    res.status(404).json({ message: "Plans not found" });
                }
            }
        });
    }

  public static getPlanByName(
    req: express.Request,
    res: express.Response
  ): void {
    console.log("getPlanByName -", req.url);

    const { name } = req.query;

        floorplan.getPlanByName(name, (err: any, row: PlanRow | null) => {
            if (err) {
                res.status(500).json({ message: "Error fetching plan" });
            } else {
                if (row) {
                    row.data = JSON.parse(row.data.toString());
                    res.status(200).json({ plan: row });
                } else {
                    res.status(404).json({ message: "Plan not found" });
                }
            }
        });
    }

    public static savePlan(req: express.Request, res: express.Response): void {
        console.log('savePlan -', req.url);
    
        const { name, description, data, thumbnail, width, height } = req.body;
    
        const planData: PlanRow = {
            name,
            description,
            data,
            thumbnail,
            width,
            height
        };

        floorplan.savePlan(planData, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error saving plan" });
            } else {
                console.log('Plan saved successfully');
                res.status(200).json({ message: "Plan saved successfully" });
            }
        });
    }    

}

export let floorplanCntrl = new FloorplanCntrl();
