module.exports = {
  database: 'books2_server',  // 库名
  username: 'root',           // 用户名
  password: 'doro1314',       // 密码
  host: 'localhost',         
  dialect: 'mysql',           // 所用数据库
  
  // 下面是一些基础配置，详见squelize
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
