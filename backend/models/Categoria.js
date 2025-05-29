// Aqui se crea el modelo de la tabla categorias
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { Producto } from './Producto.js';

export const Categoria = sequelize.define('categorias', {
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
  nivel: {
    type: DataTypes.INTEGER,
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

Categoria.hasMany(Producto, {
    foreignKey: 'categoria_id',
    sourceKey: 'id'
})

Producto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  targetId: 'id'
});

