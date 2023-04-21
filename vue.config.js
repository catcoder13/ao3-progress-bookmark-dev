const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  filenameHashing: false,
  pages: {
    popup: {
      entry: 'src/popup/popup.js',
      template: 'public/popup.html',
      filename: 'popup.html',
      chunks: ['chunk-vendors', 'chunk-common', 'popup']
    },
    content: {
      entry: 'src/content/content.js',
      template: 'public/content.html',
      filename: 'content.html',
      chunks: ['chunk-vendors', 'chunk-common', 'content']
    }
  }
})
