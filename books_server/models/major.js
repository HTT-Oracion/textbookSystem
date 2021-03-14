module.exports = (sequelize, DataTypes) => {
  return sequelize.define('major', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    major_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  })
}