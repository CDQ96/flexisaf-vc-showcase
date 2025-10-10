const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Measurement = sequelize.define('Measurement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  neck: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  bust: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  waist: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  hip: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  shoulder: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  sleeve: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  inseam: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  outseam: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  thigh: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  calf: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  additionalMeasurements: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  measurementType: {
    type: DataTypes.ENUM('self', 'professional'),
    defaultValue: 'self'
  },
  measurementDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Establish relationship with User model
Measurement.belongsTo(User, { foreignKey: 'userId' });

module.exports = Measurement;