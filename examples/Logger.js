var genius = require('../index'); // This is only for the example, use require('genius-logger') in your application

var logger = genius(__dirname + '/config.json');

logger.log('Hello! I\'m a simple log message.');
logger.info('Hey, just so you know. This is an info message.');
logger.error('Whoa, something just went wrong!');
