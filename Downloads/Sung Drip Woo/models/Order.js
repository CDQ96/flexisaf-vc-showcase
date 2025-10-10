const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Tailor = require('./Tailor');
const Measurement = require('./Measurement');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  tailorId: {
    type: DataTypes.UUID,
    references: {
      model: Tailor,
      key: 'id'
    }
  },
  measurementId: {
    type: DataTypes.UUID,
    references: {
      model: Measurement,
      key: 'id'
    },
    allowNull: true
  },
  orderType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 
      'confirmed', 
      'in_progress', 
      'ready_for_delivery', 
      'delivered', 
      'completed', 
      'cancelled'
    ),
    defaultValue: 'pending'
  },
  materialSource: {
    type: DataTypes.ENUM('tailor', 'customer'),
    allowNull: false
  },
  materialDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tailoringPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  materialPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  deliveryPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estimatedCompletionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualCompletionDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Establish relationships
Order.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
Order.belongsTo(Tailor, { foreignKey: 'tailorId' });
Order.belongsTo(Measurement, { foreignKey: 'measurementId' });

module.exports = Order;