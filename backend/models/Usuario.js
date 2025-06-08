import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';

export const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('admin', 'empleado', 'cliente'),
    allowNull: false,
    defaultValue: 'cliente'
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});
