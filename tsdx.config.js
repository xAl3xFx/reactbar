const postcss = require('rollup-plugin-postcss');
const svg = require('rollup-plugin-svg')

module.exports = {
    rollup(config, options) {
        config.plugins.push(
            postcss(),
            svg()
        );
        return config;
    },
};