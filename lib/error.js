'use strict'

module.exports = (err,req,res,next) => {
  let message = 'uncatch exception error';
  if (err instanceof Error) {
    message = err.message
  } else if (typeof err === 'string'){
    message = err;
  } else {
    console.warn(`[WARNING] err must be a string or an instanceof Error, but in this case it's ${Object.prototype.toString.call(err)}`);
  }
  res.end(message);
}