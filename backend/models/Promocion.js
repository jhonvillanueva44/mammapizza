// Aqui se crea el modelo de la tabla promociones
import { sequelize } from '../database/database.js'
import { DataTypes } from 'sequelize'
import { DetallePromocion } from './DetallePromocion.js';

export const Promocion = sequelize.define('promociones', {
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
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true 
})

Promocion.hasMany(DetallePromocion, {
  foreignKey: 'promocion_id',
  sourceKey: 'id',
  as: 'detalles_promocion'
});

DetallePromocion.belongsTo(Promocion, {
  foreignKey: 'promocion_id',
  targetKey: 'id',
  as: 'promocion'
});
