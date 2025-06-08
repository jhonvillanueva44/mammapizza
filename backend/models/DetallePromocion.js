import { sequelize } from '../database/database.js'
import { DataTypes } from 'sequelize'

export const DetallePromocion = sequelize.define('detalles_promocion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
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
