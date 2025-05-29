// Aqui se crea el modelo de la tabla productos
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Producto = sequelize.define('productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  imagen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  unidad_medida: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  moneda: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  impuesto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  descuento: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  codigo_unspsc: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  codigo_producto: {
    type: DataTypes.STRING(50),
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
