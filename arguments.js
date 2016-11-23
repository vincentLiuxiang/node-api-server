'use strict'

let config,configDefault;
try{
  // 当打包发布daily、pre、product环境时，
  // 必需在./etc目录下执行：cp config.${NODE_ENV}.json config.json
  config = require('./etc/config.json');
} catch (e) {
  config = {};
}
configDefault = require('./etc/config.default.json');
module.exports = Object.assign({},configDefault,config);

