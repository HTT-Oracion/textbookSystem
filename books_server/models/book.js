module.exports = (sequelize, DataTypes) => {
  return sequelize.define('book', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    book_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ISBN: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publish: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    times: {
      type: DataTypes.INTEGER,
      defalutValue: 0
    },
    nums: {
      type: DataTypes.INTEGER
    }
  })
}