const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Material = sequelize.define('Material', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING, // e.g., cotton, silk, wool, etc.
    allowNull: false
  },
  color: {
    type: DataTypes.STRING
  },
  pattern: {
    type: DataTypes.STRING
  },
  pricePerYard: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantityAvailable: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  tailorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tailors',
      key: 'id'
    }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Material;