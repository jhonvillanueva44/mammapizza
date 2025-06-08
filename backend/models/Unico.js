// models/Unico.js
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';

export const Unico = sequelize.define('unicos', {
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



