// Aqui se crea el modelo de la tabla categorias
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { Producto } from './Producto.js';
import { Promocion } from './Promocion.js';

export const Categoria = sequelize.define('categorias', {
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
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true 
});

Categoria.hasMany(Producto, {
  foreignKey: 'categoria_id',
  sourceKey: 'id'
});

Producto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  targetKey: 'id'
});

Categoria.hasMany(Promocion, {
  foreignKey: 'categoria_id',
  sourceKey: 'id'
});

Promocion.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  targetKey: 'id'
});

