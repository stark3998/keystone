const sqlite3 = require('sqlite3').verbose();

// Function to create the users table
const createUsersTable = () => {
    const db = new sqlite3.Database('db/main.db');
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                MacAddress TEXT NOT NULL,
                email TEXT NOT NULL
            )
        `);
        db.close();
    });
};

// Function to insert users into the table
const insertUsers = () => {
    const usersData = [
        { MacAddress: 'e4:d3:7a:49:bb:4a', email: 'erauser1@gmail.com' },
        { MacAddress: 'e6:8a:39:51:87:f1', email: 'erauser2@gmail.com' },
        { MacAddress: 'fe:37:ac:a3:22:1a', email: 'erauser3@gmail.com' },
        { MacAddress: '40:de:7b:d4:79:3f', email: 'erauser4@gmail.com' }
    ];

    const db = new sqlite3.Database('db/main.db');
    db.serialize(() => {
        const stmt = db.prepare('INSERT INTO users (MacAddress, email) VALUES (?, ?)');
        usersData.forEach(user => {
            stmt.run(user.MacAddress, user.email);
        });
        stmt.finalize();
        db.close();
    });
};

// Call functions to create table and insert data
createUsersTable();
insertUsers();