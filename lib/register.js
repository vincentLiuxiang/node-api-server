'use strict'

var path = require('path');
var fs = require('fs');
var config = require('../arguments');

// mysql连接和redis连接等
var connection = {mysqlConn:null,redisConn:null};

module.exports = (app) => {
  return (req,res,next) => {
    if ('[object Object]' !== Object.prototype.toString.call(req.body)) {
      return next(new Error(`register fail: illegal http request body, \
        please check your Content-Type or http request Method`));
    }

    let apiService = req.body.service;
    let illegal = isServiceIllegal(apiService);
    if (illegal) {
      return next(new Error(illegal));
    }

    let apiSrcs,apiDir,apiRouteIndex,apiRoute;

    try {
      apiDir = path.join(__dirname,'../service',apiService,'controller')
      apiSrcs = fs.readdirSync(apiDir)
    } catch (e) {
      if ('MODULE_NOT_FOUND' === e.code || 'ENOENT' === e.code) {
        // 防止将服务端的服务路径信息传给前台
        return next(new Error(`register fail: ${apiService} not found`));
      }
      return next(e);
    }

    apiRoute = '/' + apiService;
    apiRouteIndex = findRoute(apiRoute,app.stack);

    if (-1 === apiRouteIndex) {
      app.stackMap[apiRoute] = {};
    }

    apiSrcs.map((src) => {
      let apiCreator = {},apiServer = {};
      let apiSrc = path.join(apiDir,src);
      let srcName = src.slice(0,src.length - 3);
      try {
        // 设置为undefined，而不是null
        require.cache[apiSrc] = undefined;
        apiCreator = require(apiSrc);
      } catch(e) {
        return next(new Error(`register fail: ${e.message}`));
      }

      if ('[object Object]' !== Object.prototype.toString.call(apiCreator)) {
        return next(new Error(`register fail: you must exports an object in \
          ${src}`))
      }

      for (let k in apiCreator) {
        let api = getApi(connection,apiCreator[k]);
        if (-1 === api) {
          next(new Error(`register fail: ${apiService} The API is illegal in \
           ${src} [${k}], It Must return like {method:'POST',middleware: \
           [Function]}.`));
          break;
        }
        apiServer['/'+srcName+'/'+k] = api;
      }
      app.stackMap[apiRoute] = apiServer;
    })


    let middleware = (req,res,nxt) => {
      let api = app.stackMap[apiRoute][req.url];
      if (!api) {
        return nxt(new Error(`There is no ${req.originalUrl} ${req.method} \
          service`));
      }

      if (req.method !== api.method) {
        return nxt(new Error(`There is no ${req.method} service of \
          ${req.originalUrl}`));
      }

      api.middleware(req,res);
    }

    if (-1 === apiRouteIndex) {
      let error = app.stack[app.stack.length - 1];
      app.stack[app.stack.length - 1] = {route:apiRoute,handle:middleware};
      app.stack.push(error)
    } else {
      app.stack[apiRouteIndex].handle = middleware;
    }

    res.end('ok!');
  }
}

function findRoute (route,stack) {
  let index = -1;
  let len = stack.length;
  let i;
  for (i = 0; i<len; i++) {
    if (route === stack[i].route) {
      index = i;
      break;
    }
  }
  return index;
}

function isServiceIllegal (service) {
  if (!service) return `service can't be '${service}'`;
  if (service.startsWith('/')) return `service can't start witch '/'`;
  if (service.endsWith('/')) return `service can't end witch '/'`;
  return false;
}

function getApi (connection,api) {
  if ('function' !== typeof api) {
    return -1;
  }
  // mysql连接和redis连接等，通过闭包的方式传给中间件
  api = api(connection);
  let capi = config.api || {};
  let illegal = api;
  for (let key in capi) {
    if (capi[key] !== typeof api[key]) {
      illegal = -1;
      break;
    }
  }
  return illegal;
}
