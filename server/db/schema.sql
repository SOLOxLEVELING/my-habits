-- schema.sql
--
-- This script defines the database schema for the Habit Tracker application.
-- It includes tables for users, habits, daily logs, and streak tracking.

-- Extension to generate UUIDs if you prefer them over SERIAL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- Users Table
-- Stores user account information.
-- =================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Storing the user's timezone is crucial for sending reminders correctly.
    -- e.g., 'America/New_York', 'Europe/London', 'Asia/Kolkata'
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- Habits Table
-- Stores the habits defined by each user.
-- =================================================================
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20) NOT NULL DEFAULT '#808080',
    icon VARCHAR(50),
    frequency_type VARCHAR(20) NOT NULL DEFAULT 'daily',
    frequency_details JSONB,
    -- New columns for smart reminders
    reminder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_time TIME, -- Stores the time of day, e.g., '08:30:00'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- Habit Logs Table
-- Records the status of a habit on a specific day.
-- =================================================================
CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed', -- e.g., 'completed', 'skipped'
    notes TEXT,
    -- Ensures that there is only one log entry per habit per day.
    UNIQUE (habit_id, log_date)
);

-- =================================com================================
-- Streaks Table
-- Tracks the current and longest streaks for each habit.
-- This maintains a one-to-one relationship with the habits table.
-- =================================================================
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL UNIQUE REFERENCES habits(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_log_date DATE
);

-- =================================================================
-- Indexes for Performance
-- Add indexes on frequently queried columns, especially foreign keys.
-- =================================================================
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_streaks_habit_id ON streaks(habit_id);