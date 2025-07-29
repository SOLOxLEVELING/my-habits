// Function to generate fake log objects with dates and notes
const generateMockLogs = (daysAgo) => {
  const logs = [];
  const today = new Date();
  const notes = [
    "Felt great today!",
    "A bit tired, but pushed through.",
    "Easy session.",
    "Struggled a little with focus.",
    "Really proud of this one.",
    "Almost forgot!",
  ];

  for (let i = 0; i < daysAgo; i++) {
    // Only log on roughly 70% of allowed days to make it look real
    if (Math.random() < 0.7) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      logs.push({
        date: date.toISOString().split("T")[0], // Format as 'YYYY-MM-DD'
        note:
          Math.random() < 0.5
            ? notes[Math.floor(Math.random() * notes.length)]
            : "",
      });
    }
  }
  // Sort by date descending
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const initialHabits = [
  {
    id: 1,
    name: "Read for 20 minutes",
    description: 'Finish "The Silent Patient"',
    color: "bg-blue-500",
    icon: "📚",
    frequency: ["Mon", "Wed", "Fri", "Sun"],
    completed: true,
    current_streak: 12,
    longest_streak: 25,
  },
  {
    id: 2,
    name: "Morning Run",
    description: "5km at a steady pace",
    color: "bg-green-500",
    icon: "🏃",
    frequency: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    completed: false,
    current_streak: 5,
    longest_streak: 5,
  },
  {
    id: 3,
    name: "Drink 8 glasses of water",
    description: "Stay hydrated",
    color: "bg-sky-400",
    icon: "💧",
    frequency: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    completed: false,
    current_streak: 34,
    longest_streak: 50,
  },
  {
    id: 4,
    name: "Meditate",
    description: "10 minutes of mindfulness",
    color: "bg-purple-500",
    icon: "🧘",
    frequency: ["Sat", "Sun"],
    completed: false,
    current_streak: 0,
    longest_streak: 10,
  },
];

// Mock logs mapped by habit ID
export const habitLogs = {
  1: generateMockLogs(180),
  2: generateMockLogs(180),
  3: generateMockLogs(180),
  4: generateMockLogs(180),
};
