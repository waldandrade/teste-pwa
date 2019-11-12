module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('lotos')
      .test(/\.(lib|lotos)$/i)
      .use('url-loader')
      .loader('url-loader')
      .end()
  }
}
