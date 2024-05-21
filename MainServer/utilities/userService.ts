import { getDatabaseInstance } from "../service";
import { User, dbUsersResponse } from "../support/interfaces";

export class UserService {

    private static getAllUsersFromDb(callback: (err: any, rows: User[] | null) => void): void {
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get all plans from the database
        const selectQuery = `SELECT * FROM users`;
        db.all(selectQuery, [], function (err, rows: User[]) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    public static getAllUsers(): Promise<dbUsersResponse> {
        return new Promise((resolve, reject) => {
            UserService.getAllUsersFromDb((err: any, rows: User[] | null) => {
                if (err) {
                    reject({error: "Error fetching plan", code: 500})
                } else {
                    if (rows) {
                        // rows = rows.map((row) => {
                        // //   const data = JSON.parse(row.data.toString());
                        //   return {
                        //     ...row,
                        //     // data,
                        //   };
                        // });
                        resolve({payload: rows, code: 200});
                    } else {
                        reject({error: "Plan not found", code: 404});
                    }
                }
            });
        })
    }

}