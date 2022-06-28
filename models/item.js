'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) { // called in server/bin/www
      // define association here
      this.hasMany(models.Offer, { foreignKey: 'itemId' })
      this.belongsTo(models.User, { foreignKey: 'userId' })
      this.hasMany(models.Media, { foreignKey: 'itemId' })
      this.hasOne(models.Location, { foreignKey: 'itemId' })
    }
  }
  Item.init({
    name: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT
    },
    location: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'item',
    timestamps: true
  })

  return Item
}
