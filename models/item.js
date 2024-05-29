const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  starting_price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  current_price: {
    type: DataTypes.DECIMAL,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Assumes you have a 'users' table
      key: 'id',
    },
  },
}, {
  tableName: 'items',
  hooks: {
    beforeCreate: (item) => {
      if (item.current_price === null) {
        item.current_price = item.starting_price;
      }
    },
  },
});

module.exports = Item;
