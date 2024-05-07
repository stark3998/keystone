import * as sqlite3 from 'sqlite3';

let dbInstance: sqlite3.Database | null = null;

export const getDatabaseInstance = (): sqlite3.Database => {
    if (!dbInstance) {
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

const createPlansTable = (): void => {
    dbInstance?.run(`CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            data BLOB
        )`, (err) => {
        if (err) {
            console.error('Error creating plans table:', err);
        } else {
            console.log('Plans table created successfully');
        }
    });
};
