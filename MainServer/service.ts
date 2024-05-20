import * as sqlite3 from 'sqlite3';

let dbInstance: sqlite3.Database | null = null;

/**
 * Function to get the singleton instance of the SQLite database.
 * @returns {sqlite3.Database} The SQLite database instance.
 */
export const getDatabaseInstance = (): sqlite3.Database => {
    if (!dbInstance) {
        // Create a new SQLite database instance if it doesn't exist
        dbInstance = new sqlite3.Database('db/main.db', (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('Database connected successfully');
                createPlansTable();
            }
        });
    }
    return dbInstance;
};

/**
 * Function to create the 'plans' table if it doesn't exist.
 * @returns {void}
 */
const createPlansTable = (): void => {
    // Run the SQLite query to create the 'plans' table
    dbInstance?.run(`CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        data TEXT,
        thumbnail TEXT,
        width INTEGER,
        height INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating plans table:', err);
        } else {
            console.log('Plans table created successfully');
        }
    });
};
