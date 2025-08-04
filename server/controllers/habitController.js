const db = require("../db"); // Make sure this path is correct

// A helper to convert day names from the frontend ("Mon") to ISO day numbers for the database (1).
const dayNameToIso = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

// GET /api/habits
exports.getAllHabits = async (req, res) => {
  // In a real app, you'd get the user ID from the request, e.g., req.user.id
  const userId = 1; // Using a placeholder user ID for now
  try {
    const { rows } = await db.query(
      `SELECT 
         h.*, 
         s.current_streak, 
         s.longest_streak,
         (SELECT json_agg(l.* ORDER BY l.log_date DESC) FROM habit_logs l WHERE l.habit_id = h.id) as logs
       FROM habits h
       LEFT JOIN streaks s ON h.id = s.habit_id
       WHERE h.user_id = $1 
       ORDER BY h.created_at DESC`,
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
  const userId = 1; // Placeholder user ID
  try {
    const { rows } = await db.query(
      `SELECT h.*, s.current_streak, s.longest_streak,
              (SELECT json_agg(l.* ORDER BY l.log_date DESC) FROM habit_logs l WHERE l.habit_id = h.id) as logs
       FROM habits h
       LEFT JOIN streaks s ON h.id = s.habit_id
       WHERE h.id = $1 AND h.user_id = $2`,
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  const userId = 1; // Placeholder user ID
  const {
    name,
    description,
    color,
    icon,
    frequency, // e.g., ["Mon", "Wed", "Fri"]
    reminder_enabled,
    reminder_time,
  } = req.body;

  // --- Data Transformation ---
  // Determine frequency type and details based on form input
  const isDaily = frequency.length === 7;
  const frequency_type = isDaily ? "daily" : "weekly";
  const dayNumbers = frequency.map((day) => dayNameToIso[day]);
  const frequency_details = isDaily
    ? null
    : JSON.stringify({ days: dayNumbers });

  const query = `
    INSERT INTO habits 
      (user_id, name, description, color, icon, frequency_type, frequency_details, reminder_enabled, reminder_time)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    userId,
    name,
    description,
    color,
    icon,
    frequency_type,
    frequency_details,
    reminder_enabled,
    reminder_time,
  ];

  try {
    // We will expand this to also create a streak entry
    const { rows } = await db.query(query, values);
    const newHabit = rows[0];

    // Also create a corresponding entry in the streaks table
    await db.query("INSERT INTO streaks (habit_id) VALUES ($1)", [newHabit.id]);

    console.log("Habit created successfully:", newHabit);
    res.status(201).json(newHabit);
  } catch (error) {
    console.error("Error creating habit:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  const { id } = req.params;
  const userId = 1; // Placeholder user ID
  const {
    name,
    description,
    color,
    icon,
    frequency,
    reminder_enabled,
    reminder_time,
  } = req.body;

  // --- Data Transformation ---
  const isDaily = frequency.length === 7;
  const frequency_type = isDaily ? "daily" : "weekly";
  const dayNumbers = frequency.map((day) => dayNameToIso[day]);
  const frequency_details = isDaily
    ? null
    : JSON.stringify({ days: dayNumbers });

  const query = `
        UPDATE habits SET 
            name = $1, 
            description = $2, 
            color = $3, 
            icon = $4, 
            frequency_type = $5, 
            frequency_details = $6, 
            reminder_enabled = $7, 
            reminder_time = $8
        WHERE id = $9 AND user_id = $10
        RETURNING *;
    `;
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
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Habit not found or user not authorized." });
    }
    console.log(`Habit ${id} updated successfully.`);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error updating habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  const { id } = req.params;
  const userId = 1; // Placeholder user ID

  try {
    const result = await db.query(
      "DELETE FROM habits WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    // rowCount will be 1 if a row was deleted, 0 otherwise.
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Habit not found or user not authorized." });
    }
    console.log(`Habit ${id} deleted successfully.`);
    res.status(204).send(); // Standard success response for delete
  } catch (error) {
    console.error(`Error deleting habit ${id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/habits/:id/logs
exports.addHabitLog = async (req, res) => {
  const { id: habit_id } = req.params;
  const { date, note } = req.body; // Expects a date like 'YYYY-MM-DD'

  try {
    const query = `
            INSERT INTO habit_logs (habit_id, log_date, notes, status)
            VALUES ($1, $2, $3, 'completed')
            ON CONFLICT (habit_id, log_date) DO NOTHING
            RETURNING *;
        `;
    const { rows } = await db.query(query, [habit_id, date, note]);
    console.log(`Log added for habit ${habit_id} on ${date}`);
    res.status(201).json({ message: "Log added successfully", log: rows[0] });
  } catch (error) {
    console.error(`Error adding log for habit ${habit_id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add this new function
exports.deleteHabitLog = async (req, res) => {
  const { id: habit_id, date: log_date } = req.params;
  const userId = 1; // Placeholder user ID

  try {
    // We join with habits to ensure the user owns the habit they are modifying
    const result = await db.query(
      `DELETE FROM habit_logs hl
       USING habits h
       WHERE hl.habit_id = h.id
         AND h.user_id = $1
         AND hl.habit_id = $2
         AND hl.log_date = $3`,
      [userId, habit_id, log_date]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Log entry not found." });
    }

    console.log(`Log deleted for habit ${habit_id} on ${log_date}`);
    res.status(204).send(); // 204 No Content is standard for a successful delete
  } catch (error) {
    console.error(`Error deleting log for habit ${habit_id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ... other controller methods like updateLogNote would also need implementing ...
exports.updateLogNote = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};
