'use strict'

/**
 * 请注意，该方案还不是完整的解决方案，
 * 比如：假如该主进程服务挂了，在重启的过程中
 * 必需将之前注册的服务全加载进来。
 *
 * 目前该演示代码还没提供给此功能
 */

var bodyparser = require('./lib/bodyparser');
var register = require('./lib/register');
var error = require('./lib/error');
var app = require('connect')();

app.stackMap = {};
app.use(bodyparser);
app.use('/register',register(app));
app.use(error);

app.listen(3000,() => {
  console.log(3000);
})


