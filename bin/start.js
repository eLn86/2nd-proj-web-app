#!/usr/bin/env node
/* eslint strict: 0 */
// const fs = require('fs');
'use strict';

/**
 * Module dependencies.
 */

// enables ES6 ('import'.. etc) in Node
require('babel-core/register');
require('babel-polyfill');

const app = require('../app').default;


// const debug = require('debug')('2nd-proj-web-app:server');
// 
//
// /**
//  * Normalize a port into a number, string, or false.
//  */
//
// const normalizePort = function(val) {
//   const port = parseInt(val, 10);
//
//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }
//
//   if (port >= 0) {
//     // port number
//     return port;
//   }
//
//   return false;
// };
//
// /**
//  * Get port from environment and store in Express.
//  */
// const port = normalizePort(process.env.PORT || '3000');
//
//
// /**
//  * Listen on provided port, on all network interfaces.
//  */
// server.listen(port);
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// server.on('error', (error) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//
//   const bind = typeof port === 'string'
//    ? `Pipe ${port}`
//    : `Port ${port}`;
//
//    // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       // debug(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       // debug(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });
//
// /**
//  * Event listener for HTTPS server "listening" event.
//  */
//
// server.on('listening', () => {
//   const addr = server.address();
//   const bind = typeof addr === 'string'
//     ? `pipe ${addr}`
//     : `port ${addr.port}`;
//   // debug(`Listening on ${bind}`);
// });
