// Aqui se crea el modelo de la tabla tamanios
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { TamanioSabor } from './TamanioSabor.js';

export const Tamanio = sequelize.define('tamanios', {
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

Tamanio.hasMany(TamanioSabor, {
    foreignKey: 'tamanio_id',
    sourceKey: 'id'
});

TamanioSabor.belongsTo(Tamanio, {
    foreignKey: 'tamanio_id',
    targetKey: 'id',
    as: 'tamanio'
});
