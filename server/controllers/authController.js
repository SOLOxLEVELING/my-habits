// controllers/authController.js

const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password, timezone } = req.body;
  if (!username || !email || !password || !timezone) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserResult = await db.query(
      "INSERT INTO users (username, email, password_hash, timezone) VALUES ($1, $2, $3, $4) RETURNING id, username, email, timezone",
      [username, email, hashedPassword, timezone]
    );
    const newUser = newUserResult.rows[0];

    res.status(201).json({
      ...newUser,
      token: generateToken(newUser.id),
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0];

    if (await bcrypt.compare(password, user.password_hash)) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        timezone: user.timezone,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
