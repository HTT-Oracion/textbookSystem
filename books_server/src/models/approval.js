export default (sequelize, DataTypes) => {
  return sequelize.define('approval', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}