export default (sequelize, DataTypes) => {
  return sequelize.define('department', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    dep_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  })
}