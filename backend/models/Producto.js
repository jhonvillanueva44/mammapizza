// Aqui se crea el modelo de la tabla producto
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';
import { Combinacion } from './Combinacion.js';
import { Unico } from './Unico.js';
import { DetallePromocion } from './DetallePromocion.js';

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
    defaultValue: false
  },
  habilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  unico_sabor: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
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

Producto.hasMany(Combinacion, {
  foreignKey: 'producto_id',
  sourceKey: 'id'
});

Combinacion.belongsTo(Producto, {
  foreignKey: 'producto_id',
  targetKey: 'id'
});


Producto.hasMany(Unico, {
  foreignKey: 'producto_id',
  sourceKey: 'id'
});

Unico.belongsTo(Producto, {
  foreignKey: 'producto_id',
  targetKey: 'id',
  as: 'producto'
});

Producto.hasMany(DetallePromocion, {
  foreignKey: 'producto_id',
  sourceKey: 'id'
});

DetallePromocion.belongsTo(Producto, {
  foreignKey: 'producto_id',
  targetKey: 'id'
});