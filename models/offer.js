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
    text: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Offer',
    tableName: 'offer',
    timestamps: true
  })

  return Offer
}
