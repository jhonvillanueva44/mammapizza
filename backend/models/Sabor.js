// Aqui se crea el modelo de la tabla sabores
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { TamanioSabor } from './TamanioSabor.js';

export const Sabor = sequelize.define('sabores', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  especial: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  tipo: {
    type: DataTypes.ENUM('Pizza', 'Calzone', 'Pasta', 'Agregado', 'Bebida'),
    allowNull: false
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

Sabor.hasMany(TamanioSabor, {
    foreignKey: 'sabor_id',
    sourceKey: 'id'
});

TamanioSabor.belongsTo(Sabor, {
    foreignKey: 'sabor_id',
    targetKey: 'id',
    as: 'sabor'
});


