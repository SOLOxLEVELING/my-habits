// This controller will contain placeholder logic for now.
// We will replace it with database queries in the next step.

// GET /api/habits
exports.getAllHabits = (req, res) => {
  console.log("Fetching all habits...");
  // Placeholder data
  const mockHabits = [
    { id: 1, name: "Read for 20 minutes", current_streak: 12 },
    { id: 2, name: "Morning Run", current_streak: 5 },
  ];
  res.status(200).json(mockHabits);
};

// GET /api/habits/:id
exports.getHabitById = (req, res) => {
  const { id } = req.params;
  console.log(`Fetching habit with ID: ${id}`);
  // Placeholder data
  const mockHabitDetail = {
    id: id,
    name: "Morning Run",
    description: "5km at a steady pace",
    current_streak: 5,
    longest_streak: 10,
    logs: [
      { date: "2025-07-26", note: "Felt great!" },
      { date: "2025-07-25", note: "A bit tired." },
    ],
  };
  res.status(200).json(mockHabitDetail);
};

// POST /api/habits
exports.createHabit = (req, res) => {
  const newHabit = req.body;
  console.log("Creating new habit:", newHabit);
  res.status(201).json({ id: Date.now(), ...newHabit });
};

// PUT /api/habits/:id
exports.updateHabit = (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;
  console.log(`Updating habit ${id} with:`, updatedInfo);
  res.status(200).json({ id: id, ...updatedInfo });
};

// DELETE /api/habits/:id
exports.deleteHabit = (req, res) => {
  const { id } = req.params;
  console.log(`Deleting habit ${id}`);
  res.status(204).send(); // 204 No Content is standard for a successful delete
};

// POST /api/habits/:id/logs
exports.addHabitLog = (req, res) => {
  const { id } = req.params;
  const logData = req.body; // e.g., { date: 'YYYY-MM-DD' }
  console.log(`Adding log for habit ${id}:`, logData);
  res.status(201).json({ message: "Log added successfully" });
};

// PUT /api/habits/:habitId/logs
exports.updateLogNote = (req, res) => {
  const { habitId } = req.params;
  const { date, note } = req.body;
  console.log(
    `Updating note for habit ${habitId} on date ${date} with: "${note}"`
  );
  res.status(200).json({ message: "Note updated successfully" });
};
