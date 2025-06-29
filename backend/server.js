// Aqui iniciaremos el servidor express usando la configiración definida para las variables de entorno
import app from "./app.js";
import config from "./config/config.js";
import { sequelize } from "./database/database.js";

async function main() {
  try {
    await sequelize.sync({ force: false, alter: false });
    app.listen(config.PORT);
    console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

main();
