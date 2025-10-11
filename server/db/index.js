// db.js

const { Pool } = require("pg");
require("dotenv").config();

// This configuration object will be used by the Pool.
// It is designed to work both locally and on Fly.io.
const config = {
  // It reads the single DATABASE_URL from your .env file locally
  // and from the secrets you set on Fly.io.
  connectionString: process.env.DATABASE_URL,
};

// For production environments (like on Fly.io), we MUST enable SSL.
// This block adds the necessary SSL configuration when deployed.
// The NODE_ENV variable is automatically set to "production" by many hosting providers.
if (process.env.NODE_ENV === "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(config);

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
