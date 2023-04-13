const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
  }
}