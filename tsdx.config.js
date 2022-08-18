const postcss = require('rollup-plugin-postcss');
import svg from 'rollup-plugin-svg'

module.exports = {
    rollup(config, options) {
        config.plugins.push(
            postcss(),
            svg()
        );
        return config;
    },
};