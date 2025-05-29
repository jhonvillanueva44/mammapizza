// Aqui definiremos en un mapa las variables de entorno que usaremos en el proyecto
import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
}

export default config;