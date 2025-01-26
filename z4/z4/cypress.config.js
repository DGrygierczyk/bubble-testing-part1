const { defineConfig } = require('cypress')
const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const webpackConfig = require('./webpack.config.js')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', webpackPreprocessor({ webpackOptions: webpackConfig }))
    },
    baseUrl: 'https://demoqa.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 1
    }
  },
}) 