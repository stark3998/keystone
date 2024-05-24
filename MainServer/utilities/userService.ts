import { getDatabaseInstance } from "../service";
import { User, dbUsersResponse } from "../support/interfaces";

export class UserService {

    private static primary_user_table = "users";
    private static secondary_user_table = "users_random";

    private static getAllUsersFromDb(tableName: string, callback: (err: any, rows: User[] | null) => void): void {
        // Connect to the SQLite database
        const db = getDatabaseInstance();

        // Get all plans from the database
        var selectQuery = `SELECT * FROM ${tableName}`;
        db.all(selectQuery, [], function (err, rows: User[]) {
            if (err) {
                console.error('Error fetching users:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    public static getAllUsers(): Promise<dbUsersResponse> {
        return new Promise((resolve, reject) => {
            UserService.getAllUsersFromDb(UserService.primary_user_table, (err: any, primary_users: User[] | null) => {
                if (primary_users) {
                    UserService.getAllUsersFromDb(UserService.secondary_user_table, (err: any, secondary_users: User[] | null) => {
                        if (secondary_users) {
                            resolve({ payload: { "primary_users": primary_users, "secondary_users": secondary_users }, code: 200 });
                        }
                        else {
                            reject({ error: "Secondary Users not found", code: 404 });
                        }
                    });
                }
                else {
                    reject({ error: "Primary Users not found", code: 404 });
                }
            });
        });
    }
}