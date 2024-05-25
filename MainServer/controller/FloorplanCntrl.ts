import express from 'express';
import { Validator } from '../support/validator';
import { getDatabaseInstance } from '../service';
import { dbFloorRowResponse, PlanRow } from '../support/interfaces';
import { Floorplan, floorplan } from '../utilities/floorplan';

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

    // Adding the delete route
    router.route("/deletePlan").delete(Validator.validate, FloorplanCntrl.deletePlan);

    router.route("/getPlanIds").get(Validator.validate, FloorplanCntrl.getPlanIds);

  }

  public static getPlanIds(req: express.Request, res: express.Response): void {
    console.log('getPlanIds -', req.url);

    floorplan.getAllPlanIds((err: any, rows: [{ "id": number }] | null) => {
      if (err) {
        res.status(500).json({ message: "Error fetching plan ids" });
      } else {
        if (rows) {
          res.status(200).json({ planIds: rows });
        } else {
          res.status(404).json({ message: "Plan ids not found" });
        }
      }
    });
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

    var name = req.query.name ? req.query.name.toString() : 'DBH 6th Floor';

    Floorplan.getFloorPlanByName(name).then((floorplan: dbFloorRowResponse) => res.status(floorplan.code).send({ plan: floorplan.payload! }))
      .catch((err: dbFloorRowResponse) => res.status(err.code).send({ message: err.error! }));

    // floorplan.getPlanByName(name, (err: any, row: PlanRow | null) => {
    //     if (err) {
    //         res.status(500).json({ message: "Error fetching plan" });
    //     } else {
    //         if (row) {
    //             row.data = JSON.parse(row.data.toString());
    //             res.status(200).json({ plan: row });
    //         } else {
    //             res.status(404).json({ message: "Plan not found" });
    //         }
    //     }
    // });
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

  // New deletePlan method
  public static deletePlan(req: express.Request, res: express.Response): void {
    console.log('deletePlan -', req.url);

    const { name } = req.query;

    if (!name) {
      res.status(400).json({ message: "Plan name is required" });
    }

    floorplan.deletePlan(name, function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting plan" });
      } else {
        console.log('Plan deleted successfully');
        res.status(200).json({ message: "Plan deleted successfully" });
      }
    });
  }
}

export let floorplanCntrl = new FloorplanCntrl();
