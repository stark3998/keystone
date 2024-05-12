import { PlanRow } from '../support/interfaces';
import { getDatabaseInstance } from '../service';
import { myNode } from '../escapeRouteProcessor/A*';

class Floorplan {

    public getPlanByName(name: any, callback: (err: any, row: PlanRow | null) => void): void {
        console.log('getPlanByName in floorplan.ts - ', name);
        
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

    public getAllPlans(callback: (err: any, rows: PlanRow[] | null) => void): void {
        console.log('getAllPlans in floorplan.ts - ');
        
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get plan from database by name
        const selectQuery = `SELECT * FROM plans`;
        db.all(selectQuery, [], function (err, rows: PlanRow[]) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }
    
    public savePlan(planData: PlanRow, callback: (err: any) => void): void {
        const { name, description, data, thumbnail, width, height } = planData;

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

    public getAccessPoints(plan: PlanRow): myNode[]{
        var accessPoints: myNode[] = [];
        const data = JSON.parse(plan.data.toString());
        data.access.forEach((ap: { x: number; y: number; }) => {
            const node = new myNode(ap.x, ap.y);
            accessPoints.push(node);
        });

        console.log("Access points are : ", accessPoints);

        return accessPoints;
    }

}

export let floorplan = new Floorplan();
