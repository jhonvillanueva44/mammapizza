// Aqui se crea el modelo de la tabla combinacion
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';

export const Combinacion = sequelize.define('combinaciones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true 
});


