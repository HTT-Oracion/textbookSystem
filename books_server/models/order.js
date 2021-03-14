module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    approval_date: {
      type: DataTypes.TEXT
    },
    charge_status: {
      type: DataTypes.INTEGER
    },
    approval_status: {
      type: DataTypes.INTEGER
    }
  })
}