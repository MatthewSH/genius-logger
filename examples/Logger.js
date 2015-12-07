/**
 * The following example is very simple, if you need more explanation please check the documentation.
 */

var genius = require('../index'); // This is only for the example, use require('genius-logger') in your application

var logger = genius(__dirname + '/config.json');
logger.log('Hello! I\'m a simple log message.');
logger.info('Hey, just so you know. This is an info message.');
logger.error('Whoa, something just went wrong!');

/**
 * The simple logger is not like the main logger, and it will not take all the configuration like the normal logger. 
 * It will just log everything to the file.
 * Great for when you have multiple instances of something (much like a bot) and you need to log it's actions quickly.
 */
var simple = genius.simple('name.log');
simple.log('Hello! I\'m a simple log message.');
simple.info('Hey, just so you know. This is an info message.');
simple.error('Whoa, something just went wrong!');