module.exports = (sequelize, DataTypes) => {
  return sequelize.define('class', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    grade: {
      type: DataTypes.INTEGER,
      unique: true
    },
    major: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cls_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER
    },
    monitor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}