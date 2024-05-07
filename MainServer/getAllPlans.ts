import * as express from 'express';
import { getDatabaseInstance } from './service';

const router = express.Router();

router.get('/api/getAllPlans', async (req, res) => {
  // Connect to the SQLite database
  const db = getDatabaseInstance();

  // Get all plans from the database
  const selectQuery = `SELECT * FROM plans`;
  db.all(selectQuery, [], (err: any, rows: any) => {
    if (err) {
      res.status(500).json({ message: "Error fetching plans" });
    } else {
      res.status(200).json({ plans: rows });
    }

    // Close the database connection
    db.close();
  });
});

export default router;
