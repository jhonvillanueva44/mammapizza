// Aqui se crea el modelo de la tabla tipos
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Producto } from './Producto.js';

export const Tipo = sequelize.define('tipos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  abreviatura: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: true,         
  freezeTableName: true    
});

Tipo.hasMany(Producto, {
  foreignKey: 'tipo_id',
  sourceKey: 'id'
});

Producto.belongsTo(Tipo, {
  foreignKey: 'tipo_id',
  targetId: 'id'
});
