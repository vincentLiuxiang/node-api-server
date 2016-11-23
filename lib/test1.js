// import!
'use strict';

// @ post
exports.hello = (config) => {
  let midware = (req,res) => {
    console.log('@@',config);
    console.log('@@',req.method);
    if (req.method !== 'POST') {
      return res.end('req.method must be post !');
    }
    res.end('hello');
  }
  return {method:'POST',middleware:midware}
}

exports.world = (config) => {
  let midware = (req,res) => {
    console.log('@@',config);
    console.log('@@',req.method);
    res.end('world');
  }
  return {method:'GET',middleware:midware}
}





