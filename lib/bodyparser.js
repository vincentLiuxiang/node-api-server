'use strict'

module.exports = (req,res,next) => {

  console.log(req.url);

  if (req.method !== 'POST') {
    return next();
  }

  if (req.headers['content-type'] !== 'application/json') {
    return next();
  }

  let buffers = [];

  req.on('data',(buf) => {
    buffers.push(buf);
  })

  req.on('end',() => {
    let error = null;
    try{
      req.body = JSON.parse(buffers.toString());
    } catch (e) {
      error = e
    }
    next(error);
  })

}