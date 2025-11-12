// src/api.js

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unknown error occurred.",
    }));
    throw new Error(error.message || "Network response was not ok");
  }
  return response.json();
};

export const fetchHabits = async (token) => {
  const response = await fetch(`${apiUrl}/api/habits`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const saveHabit = async (token, habitData, habitId) => {
  const isEditing = !!habitId;
  const url = isEditing
    ? `${apiUrl}/api/habits/${habitId}`
    : `${apiUrl}/api/habits`;
  const method = isEditing ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(token),
    body: JSON.stringify(habitData),
  });
  return handleResponse(response);
};

export const deleteHabit = async (token, habitId) => {
  const response = await fetch(`${apiUrl}/api/habits/${habitId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete the habit.");
  }
  return { success: true };
};

export const toggleHabitLog = async (token, habitId, date, isCompleted) => {
  if (isCompleted) {
    const response = await fetch(`${apiUrl}/api/habits/${habitId}/logs/${date}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    if (!response.ok && response.status !== 404) {
      throw new Error("Failed to delete log");
    }
  } else {
    const response = await fetch(`${apiUrl}/api/habits/${habitId}/logs`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ date }),
    });
    return handleResponse(response);
  }
};

export const saveNote = async (token, habitId, logDate, newNote) => {
  const response = await fetch(`${apiUrl}/api/habits/${habitId}/logs`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      log_date: logDate,
      note: newNote,
    }),
  });
  return handleResponse(response);
};
