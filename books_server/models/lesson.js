module.exports = (sequelize, DataTypes) => {
  return sequelize.define('lesson', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    lesson_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    started: {
      type: DataTypes.STRING
    },
    teacher_num: DataTypes.INTEGER
  })
}