import express, { Request, Response } from 'express';
import { getDatabaseInstance } from './service';

// Define a type for the row object retrieved from the database
interface PlanRow {
  name: string;
  description: string;
  data: string; // Assuming data is stored as a string in the database
}

const router = express.Router();

router.get('/api/getPlanByName', async (req: Request, res: Response) => {
  const { name } = req.query;

  // Connect to the SQLite database
  const db = getDatabaseInstance();

  // Get plan from database by name
  const selectQuery = `
    SELECT * FROM plans
    WHERE name = ?
  `;
  db.get(selectQuery, [name], function (err, row: PlanRow) {
    if (err) {
      res.status(500).json({ message: "Error fetching plan" });
    } else {
      if (row) {
        // Deserialize data from bytes to JSON
        const data = JSON.parse(row.data);
        res.status(200).json({ name: row.name, description: row.description, data });
      } else {
        res.status(404).json({ message: "Plan not found" });
      }
    }

    // Close the database connection
    db.close();
  });
});

export default router;
