'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) { // called in server/bin/www
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' })
      this.hasMany(models.Media, { foreignKey: 'itemId' })
      this.hasOne(models.Location, { foreignKey: 'itemId' })
    }
  }
  Offer.init({
    name: {
      type: DataTypes.STRING
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

  return Offer
}
