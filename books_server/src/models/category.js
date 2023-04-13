export default (sequelize, DataTypes) => {
  return sequelize.define('category', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    cat_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  })
}