import Sequelize from "sequelize";
import config from "../config/config.js";

export const sequelize = new Sequelize( config.DB_DATABASE, config.DB_USER, config.DB_PASSWORD ,{
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

