// import!
'use strict';

// config包含mysql,redis等连接
exports.hello = (config) => {
  let midware = (req,res) => {
    console.log('@@',config);
    if (req.method !== 'GET') {
      return res.end('req.method must be GET !');
    }
    res.end('hello world');
  }
  return {method:'GET',middleware:midware}
}

exports.world = (config) => {
  let midware = (req,res) => {
    res.end('world');
  }
  return {method:'POST',middleware:midware}
}