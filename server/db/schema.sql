-- -- schema.sql
-- --
-- -- This script defines the database schema for the Habit Tracker application.
-- -- It includes tables for users, habits, daily logs, and streak tracking.

-- -- Extension to generate UUIDs if you prefer them over SERIAL
-- -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- =================================================================
-- -- Users Table
-- -- Stores user account information.
-- -- =================================================================
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) NOT NULL,
--     -- Storing the user's timezone is crucial for sending reminders correctly.
--     -- e.g., 'America/New_York', 'Europe/London', 'Asia/Kolkata'
--     timezone VARCHAR(50) DEFAULT 'UTC',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- =================================================================
-- -- Habits Table
-- -- Stores the habits defined by each user.
-- -- =================================================================
-- CREATE TABLE habits (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     name VARCHAR(100) NOT NULL,
--     description TEXT,
--     color VARCHAR(20) NOT NULL DEFAULT '#808080',
--     icon VARCHAR(50),
--     frequency_type VARCHAR(20) NOT NULL DEFAULT 'daily',
--     frequency_details JSONB,
--     -- New columns for smart reminders
--     reminder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
--     reminder_time TIME, -- Stores the time of day, e.g., '08:30:00'
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- =================================================================
-- -- Habit Logs Table
-- -- Records the status of a habit on a specific day.
-- -- =================================================================
-- CREATE TABLE habit_logs (
--     id SERIAL PRIMARY KEY,
--     habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
--     log_date DATE NOT NULL,
--     status VARCHAR(20) NOT NULL DEFAULT 'completed', -- e.g., 'completed', 'skipped'
--     notes TEXT,
--     -- Ensures that there is only one log entry per habit per day.
--     UNIQUE (habit_id, log_date)
-- );

-- -- =================================com================================
-- -- Streaks Table
-- -- Tracks the current and longest streaks for each habit.
-- -- This maintains a one-to-one relationship with the habits table.
-- -- =================================================================
-- CREATE TABLE streaks (
--     id SERIAL PRIMARY KEY,
--     habit_id INTEGER NOT NULL UNIQUE REFERENCES habits(id) ON DELETE CASCADE,
--     current_streak INTEGER NOT NULL DEFAULT 0,
--     longest_streak INTEGER NOT NULL DEFAULT 0,
--     last_log_date DATE
-- );

-- -- =================================================================
-- -- Indexes for Performance
-- -- Add indexes on frequently queried columns, especially foreign keys.
-- -- =================================================================
-- CREATE INDEX idx_habits_user_id ON habits(user_id);
-- CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
-- CREATE INDEX idx_streaks_habit_id ON streaks(habit_id);

--NEW

CREATE TABLE public.habit_logs (
    id integer NOT NULL,
    habit_id integer NOT NULL,
    log_date date NOT NULL,
    status character varying(20) DEFAULT 'completed'::character varying NOT NULL,
    notes text
);

CREATE SEQUENCE public.habit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.habit_logs_id_seq OWNED BY public.habit_logs.id;

CREATE TABLE public.habits (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    color character varying(20) DEFAULT '#808080'::character varying NOT NULL,
    icon character varying(50),
    frequency_type character varying(20) DEFAULT 'daily'::character varying NOT NULL,
    frequency_details jsonb,
    reminder_enabled boolean DEFAULT false NOT NULL,
    reminder_time time without time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.habits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.habits_id_seq OWNED BY public.habits.id;

CREATE TABLE public.sent_reminders (
    id integer NOT NULL,
    habit_name character varying(100) NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.sent_reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.sent_reminders_id_seq OWNED BY public.sent_reminders.id;

CREATE TABLE public.streaks (
    id integer NOT NULL,
    habit_id integer NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_log_date date
);

CREATE SEQUENCE public.streaks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.streaks_id_seq OWNED BY public.streaks.id;

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(150) UNIQUE NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sent_reminders
    ADD CONSTRAINT sent_reminders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;

-- INSERT DATA SECTION
INSERT INTO public.users (id, username, email, password_hash, created_at, updated_at)
VALUES
(1, 'demo_user', 'demo@example.com', '$2b$10$abc123hashedpasswordexample', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.habits (id, user_id, name, description, color, icon, frequency_type, frequency_details, reminder_enabled, reminder_time, created_at)
VALUES
(1, 1, 'Morning Jog', 'Jog every morning for 20 minutes', '#00bcd4', 'run', 'daily', '{"days": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}', true, '06:30:00', CURRENT_TIMESTAMP),
(2, 1, 'Read Book', 'Read 20 pages daily', '#ff9800', 'book', 'daily', '{"days": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}', true, '21:00:00', CURRENT_TIMESTAMP);

INSERT INTO public.habit_logs (id, habit_id, log_date, status, notes)
VALUES
(1, 1, CURRENT_DATE, 'completed', 'Felt great!'),
(2, 2, CURRENT_DATE, 'missed', 'Too tired.');

INSERT INTO public.streaks (id, habit_id, current_streak, longest_streak, last_log_date)
VALUES
(1, 1, 5, 10, CURRENT_DATE),
(2, 2, 2, 5, CURRENT_DATE);

INSERT INTO public.sent_reminders (id, habit_name, sent_at)
VALUES
(1, 'Morning Jog', CURRENT_TIMESTAMP),
(2, 'Read Book', CURRENT_TIMESTAMP);

SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT setval('public.habits_id_seq', (SELECT MAX(id) FROM public.habits));
SELECT setval('public.habit_logs_id_seq', (SELECT MAX(id) FROM public.habit_logs));
SELECT setval('public.streaks_id_seq', (SELECT MAX(id) FROM public.streaks));
SELECT setval('public.sent_reminders_id_seq', (SELECT MAX(id) FROM public.sent_reminders));
