const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Delivery = sequelize.define('Delivery', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  riderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'pickup_in_progress', 'picked_up', 'in_transit', 'delivered', 'failed'),
    defaultValue: 'pending'
  },
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pickupDate: {
    type: DataTypes.DATE
  },
  deliveryDate: {
    type: DataTypes.DATE
  },
  trackingCode: {
    type: DataTypes.STRING,
    unique: true
  },
  currentLocation: {
    type: DataTypes.GEOMETRY('POINT')
  },
  notes: {
    type: DataTypes.TEXT
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

module.exports = Delivery;