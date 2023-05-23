require('dotenv').config();

module.exports = {
  TOKEN_SECRET_SPOTIFY: process.env.TOKEN_SECRET_SPOTIFY || 'none',
  JWT_SECRET: process.env.JWT_SECRET || 'password',
  CLIENT_ID: process.env.CLIENT_ID || 'none',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'none',
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/HighTracks',
  OPENAI_KEY: process.env.OPENAI_KEY || 'none',
};
