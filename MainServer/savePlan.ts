import express, { Request, Response } from 'express';
import { getDatabaseInstance } from './service';

const router = express.Router();

router.post('/api/savePlan', async (req: Request, res: Response) => {
  const { name, description, data } = req.body;

  // Connect to the SQLite database
  const db = getDatabaseInstance();

  // Save plan to database
  const insertQuery = `
        INSERT INTO plans (name, description, data)
        VALUES (?, ?, ?)
      `;
  const serializedData = Buffer.from(JSON.stringify(data));

  db.run(insertQuery, [name, description, serializedData], function (err) {
    if (err) {
      res.status(500).json({ message: "Error saving plan" });
    } else {
      res.status(200).json({ message: "Plan saved successfully" });
    }

    // Close the database connection
    db.close();
  });
});

export default router;
