// controllers/habitController.js
const db = require("../db");

// A helper to calculate the difference in days between two dates
const diffDays = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const toYYYYMMDD = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET /api/habits
exports.getAllHabits = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT h.*, s.current_streak, s.longest_streak,
              (SELECT json_agg(l.* ORDER BY l.log_date DESC) FROM habit_logs l WHERE l.habit_id = h.id) as logs
       FROM habits h
       LEFT JOIN streaks s ON h.id = s.habit_id
       WHERE h.user_id = $1 ORDER BY h.created_at DESC`,
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching habits:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/habits/:id
exports.getHabitById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT h.*, s.current_streak, s.longest_streak,
              (SELECT json_agg(l.* ORDER BY l.log_date DESC) FROM habit_logs l WHERE l.habit_id = h.id) as logs
       FROM habits h
       LEFT JOIN streaks s ON h.id = s.habit_id
       WHERE h.id = $1 AND h.user_id = $2`,
      [id, userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Habit not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  const userId = req.user.id;
  // FIXED: Destructure the correct fields sent by HabitForm.jsx
  const {
    name,
    description,
    color,
    icon,
    frequency_type,     // Received directly
    frequency_details,  // Received directly
    reminder_enabled,
    reminder_time,
  } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const habitQuery = `INSERT INTO habits (user_id, name, description, color, icon, frequency_type, frequency_details, reminder_enabled, reminder_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
    
    const habitValues = [
      userId,
      name,
      description,
      color,
      icon,
      frequency_type,
      frequency_details, // Pass the object directly, pg handles JSON conversion
      reminder_enabled,
      reminder_time,
    ];
    
    const { rows } = await client.query(habitQuery, habitValues);
    const newHabit = rows[0];
    
    await client.query("INSERT INTO streaks (habit_id) VALUES ($1)", [
      newHabit.id,
    ]);
    await client.query("COMMIT");
    res.status(201).json(newHabit);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating habit:", error.message);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

// PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // FIXED: Destructure the correct fields here too
  const {
    name,
    description,
    color,
    icon,
    frequency_type,     // Received directly
    frequency_details,  // Received directly
    reminder_enabled,
    reminder_time,
  } = req.body;

  const query = `UPDATE habits SET name = $1, description = $2, color = $3, icon = $4, frequency_type = $5, frequency_details = $6, reminder_enabled = $7, reminder_time = $8 WHERE id = $9 AND user_id = $10 RETURNING *;`;
  
  const values = [
    name,
    description,
    color,
    icon,
    frequency_type,
    frequency_details,
    reminder_enabled,
    reminder_time,
    id,
    userId,
  ];
  
  try {
    const { rows } = await db.query(query, values);
    if (rows.length === 0)
      return res.status(404).json({ error: "Habit not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error updating habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await db.query(
      "DELETE FROM habits WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Habit not found" });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/habits/:id/logs
exports.addHabitLog = async (req, res) => {
  const { id: habit_id } = req.params;
  const { date: log_date, note } = req.body;

  try {
    const insertResult = await db.query(
      `INSERT INTO habit_logs (habit_id, log_date, notes, status)
       VALUES ($1, $2, $3, 'completed')
       ON CONFLICT (habit_id, log_date) DO NOTHING RETURNING id`,
      [habit_id, log_date, note]
    );

    if (insertResult.rowCount > 0) {
      let streakResult = await db.query(
        "SELECT * FROM streaks WHERE habit_id = $1",
        [habit_id]
      );
      if (streakResult.rowCount === 0) {
        await db.query(
          "INSERT INTO streaks (habit_id) VALUES ($1) ON CONFLICT (habit_id) DO NOTHING",
          [habit_id]
        );
        streakResult = await db.query(
          "SELECT * FROM streaks WHERE habit_id = $1",
          [habit_id]
        );
      }

      const streak = streakResult.rows[0];
      let newCurrentStreak = streak.current_streak;

      if (streak.last_log_date) {
        const dayDifference = diffDays(streak.last_log_date, log_date);
        if (dayDifference === 1) newCurrentStreak++;
        else if (dayDifference > 1) newCurrentStreak = 1;
      } else {
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(
        newCurrentStreak,
        streak.longest_streak
      );
      await db.query(
        `UPDATE streaks SET current_streak = $1, longest_streak = $2, last_log_date = $3 WHERE habit_id = $4`,
        [newCurrentStreak, newLongestStreak, log_date, habit_id]
      );
    }
    res.status(201).json({ message: "Log added successfully" });
  } catch (error) {
    console.error(`Error in addHabitLog for habit ${habit_id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/habits/:id/logs/:date
exports.deleteHabitLog = async (req, res) => {
  const { id: habit_id, date: log_date_to_delete } = req.params;
  const userId = req.user.id;

  try {
    const streakResult = await db.query(
      "SELECT last_log_date, current_streak FROM streaks WHERE habit_id = $1",
      [habit_id]
    );
    if (streakResult.rowCount === 0) {
      return res.status(404).json({ error: "Streak entry not found." });
    }
    const { last_log_date, current_streak } = streakResult.rows[0];

    const deleteResult = await db.query(
      `DELETE FROM habit_logs hl USING habits h
       WHERE hl.habit_id = h.id AND h.user_id = $1 AND hl.habit_id = $2 AND hl.log_date = $3`,
      [userId, habit_id, log_date_to_delete]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "Log entry not found to delete." });
    }

    if (toYYYYMMDD(last_log_date) === log_date_to_delete) {
      const newLastLogResult = await db.query(
        "SELECT log_date FROM habit_logs WHERE habit_id = $1 ORDER BY log_date DESC LIMIT 1",
        [habit_id]
      );

      if (newLastLogResult.rowCount > 0) {
        const new_last_log_date = newLastLogResult.rows[0].log_date;
        const previousStreak = current_streak > 0 ? current_streak - 1 : 0;
        await db.query(
          "UPDATE streaks SET current_streak = $1, last_log_date = $2 WHERE habit_id = $3",
          [previousStreak, new_last_log_date, habit_id]
        );
      } else {
        await db.query(
          "UPDATE streaks SET current_streak = 0, last_log_date = NULL WHERE habit_id = $1",
          [habit_id]
        );
      }
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting log for habit ${habit_id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/habits/:habitId/logs
exports.updateLogNote = async (req, res) => {
  const { habitId } = req.params;
  const { log_date, note } = req.body;
  const userId = req.user.id;

  if (!log_date) {
    return res.status(400).json({ error: "A date for the log is required." });
  }

  try {
    const result = await db.query(
      `UPDATE habit_logs hl
       SET notes = $1
       FROM habits h
       WHERE hl.habit_id = h.id
         AND hl.habit_id = $2
         AND hl.log_date = $3
         AND h.user_id = $4`,
      [note, habitId, log_date, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Log entry not found for that date." });
    }

    res.status(200).json({ message: "Note updated successfully." });
  } catch (error) {
    console.error(`Error updating note for habit ${habitId}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};