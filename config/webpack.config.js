const commonConfig = require('./webpack.common.js')
const { merge } = require('webpack-merge')

module.exports = (envVar) => {
    const { env } = envVar
    const envConfig = require(`./webpack.${env}.js`)
    const config = merge(commonConfig, envConfig)
    return config
}
