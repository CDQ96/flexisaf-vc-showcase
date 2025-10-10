const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentIntentId: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'held_in_escrow', 'released', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  escrowReleaseDate: {
    type: DataTypes.DATE
  },
  transactionFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  receiptUrl: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Payment;