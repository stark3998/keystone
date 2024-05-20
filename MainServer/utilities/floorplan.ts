import { FloorPlanResponse, PlanRow } from '../support/interfaces';
import { getDatabaseInstance } from '../service';
import { myNode } from '../escapeRouteProcessor/A*';

/**
 * Class representing operations related to floor plans.
 */
export class Floorplan {

    /**
     * Retrieves a floor plan by its name from the database.
     * @param name - The name of the floor plan.
     * @param callback - The callback function to handle the result.
     */
    public getPlanByName(name: any, callback: (err: any, row: PlanRow | null) => void): void {
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get plan from database by name
        const selectQuery = `SELECT * FROM plans WHERE name = ?`;
        db.get(selectQuery, [name], function (err, row: PlanRow) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    /**
     * Retrieves all floor plans from the database.
     * @param callback - The callback function to handle the result.
     */
    public getAllPlans(callback: (err: any, rows: PlanRow[] | null) => void): void {
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get all plans from the database
        const selectQuery = `SELECT * FROM plans`;
        db.all(selectQuery, [], function (err, rows: PlanRow[]) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    /**
     * Saves a floor plan to the database.
     * @param planData - The data of the floor plan to be saved.
     * @param callback - The callback function to handle the result.
     */
    public savePlan(planData: PlanRow, callback: (err: any) => void): void {
        const { name, description, data, thumbnail, width, height } = planData;

        // Check if data.access exists
        if (!data || !Array.isArray(data.access)) {
            callback({ message: "Access points are absent in the request" });
            return;
        }

        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Check if the plan with the given name already exists
        const selectQuery = `SELECT * FROM plans WHERE name = ?`;
        db.get(selectQuery, [name], function (err, row: PlanRow) {
            if (err) {
                callback(err);
            } else {
                if (row) {
                    // Plan already exists, update its information
                    const updateQuery = `UPDATE plans SET description = ?, data = ?, thumbnail = ?, width = ?, height = ? WHERE name = ?`;
                    const serializedData = JSON.stringify(data);
                    db.run(updateQuery, [description, serializedData, thumbnail, width, height, name], function (err) {
                        callback(err);
                    });
                } else {
                    // Plan doesn't exist, insert new plan
                    const insertQuery = `INSERT INTO plans (name, description, data, thumbnail, width, height) VALUES (?, ?, ?, ?, ?, ?)`;
                    const serializedData = JSON.stringify(data);
                    db.run(insertQuery, [name, description, serializedData, thumbnail, width, height], function (err) {
                        callback(err);
                    });
                }
            }
        });
    }

    /**
     * Deletes a floor plan from the database by its name.
     * @param name - The name of the floor plan to be deleted.
     * @param callback - The callback function to handle the result.
     */
    public deletePlan(name: any, callback: (err: any) => void): void {
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Delete plan from database by name
        const deleteQuery = `DELETE FROM plans WHERE name = ?`;
        db.run(deleteQuery, [name], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Transforms a floor plan data into a matrix representation (2D array).
     * @param plan - The floor plan data.
     * @returns A 2D array representing the floor plan.
     */
    public transformMaze(plan: PlanRow): number[][] {
        let rows: number = plan.height;
        let cols: number = plan.width;
        var maze: number[][] = new Array(rows);

        for (let i = 0; i < rows; i++) {
            maze[i] = new Array(cols).fill(0);
        }
        //blocked / walls
        const data = JSON.parse(plan.data.toString());
        data.blocked.forEach((point: { x: number; y: number; }) => {
            maze[point.x][point.y] = 1;
        });
        //access points
        // plan.data.access.forEach(point => {
        //     maze[point.x][point.y] = 9;
        // });

        return maze;
    }

    /**
     * Retrieves access points from a floor plan data.
     * @param plan - The floor plan data.
     * @returns An array of access points as myNode objects.
     */
    public getAccessPoints(plan: PlanRow): myNode[] {
        var accessPoints: myNode[] = [];
        const data = JSON.parse(plan.data.toString());
        data.access.forEach((ap: { x: number; y: number; }) => {
            const node = new myNode(ap.x, ap.y);
            accessPoints.push(node);
        });

        console.log("Access points are : ", accessPoints);

        return accessPoints;
    }

    public static getFloorPlanByName(name: any): Promise<FloorPlanResponse> {

        return new Promise((resolve, reject) => {
            floorplan.getPlanByName(name, (err: any, row: PlanRow | null) => {
                if (err) {
                    reject({error: "Error fetching plan", code: 500})
                    // res.status(500).json({ message: "Error fetching plan" });
                } else {
                    if (row) {
                        row.data = JSON.parse(row.data.toString());
                        resolve({payload: row, code: 200})
                        // res.status(200).json({ plan: row });
                    } else {
                        reject({error: "Plan not found", code: 404})
                        // res.status(404).json({ message: "Plan not found" });
                    }
                }
            });
        })
    }

}

export let floorplan = new Floorplan();
