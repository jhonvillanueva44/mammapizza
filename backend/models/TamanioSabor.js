// Aqui se crea el modelo de la tabla tamanio_sabor
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { Combinacion } from './Combinacion.js';
import { Unico } from './Unico.js';

export const TamanioSabor = sequelize.define('tamanio_sabor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
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


TamanioSabor.hasMany(Combinacion, {
  foreignKey: 'tamanio_sabor_id',
  sourceKey: 'id'
});

Combinacion.belongsTo(TamanioSabor, {
  foreignKey: 'tamanio_sabor_id',
  targetKey: 'id',
  as: 'tamanio_sabor'
});


TamanioSabor.hasMany(Unico, {
  foreignKey: 'tamanio_sabor_id',
  sourceKey: 'id'
});

Unico.belongsTo(TamanioSabor, {
  foreignKey: 'tamanio_sabor_id',
  targetKey: 'id',
  as: 'tamanios_sabor'
});
