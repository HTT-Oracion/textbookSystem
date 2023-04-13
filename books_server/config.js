module.exports = {
  database: 'books2_server',
  username: 'root',
  password: 'doro1314',
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    freezeTableName: true,
    timestamps: false,
    paranoid: false,
    operatorsAliases: false
  },
  timezone: '+08:00',
  charset: 'utf8'
}