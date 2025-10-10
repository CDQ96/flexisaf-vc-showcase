const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Tailor = sequelize.define('Tailor', {
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
  shopName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialties: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  businessHours: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  portfolio: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  acceptsInPerson: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  acceptsDigitalMeasurements: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  providesMaterials: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Establish relationship with User model
Tailor.belongsTo(User, { foreignKey: 'userId' });

module.exports = Tailor;