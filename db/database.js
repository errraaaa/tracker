require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER_HEROKU,
    password: process.env.DB_PASS_HEROKU,
    database: process.env.DB_NAME_HEROKU,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
