require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: "mssql",
    logging: true,
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mssql",
    logging: false,
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mssql",
    logging: false,
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
  },
};
