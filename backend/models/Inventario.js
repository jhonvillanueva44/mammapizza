// Aqui se crea el modelo de la tabla inventarios
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Producto } from './Producto.js';

export const Inventario = sequelize.define('inventarios', {
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
    allowNull: true
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

Inventario.hasMany(Producto, {
  foreignKey: 'inventario_id',
  sourceKey: 'id'
});

Producto.belongsTo(Inventario, {
  foreignKey: 'inventario_id',
  targetId: 'id'
});
