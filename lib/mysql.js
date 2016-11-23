'use strict';

let mysql = require('mysql');
let config = require('../arguments');
let pool = mysql.createPool(config.mysql);

let getMySql = (cb) => {
  pool.getConnection(function(err, connection) {
    cb(err, connection);
  });
}

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});






console.log('test');