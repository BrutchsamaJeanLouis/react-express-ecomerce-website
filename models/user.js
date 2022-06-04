'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) { // called in server/bin/www
      // define association here
      this.hasMany(models.Item, { foreignKey: 'userId' })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'username'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'email'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountType: {
      type: DataTypes.ENUM('standard', 'admin', 'moderator'),
      defaultValue: 'standard'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: true,
    modelName: 'User'
  })

  return User
}
