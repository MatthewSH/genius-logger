/*!
 * logger
 * Copyright(c) 2015-2016 Bag of Bots
 */

'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var moment = require('moment');
var emailModule = require('emailjs');

 /**
  * Variables
  */
var email = null;
var debug = false;
var Valid = true; // Tells me if the current instance of the Logger class is valid or not.
var config = []; // The logger configuation variable.

/**
 * Expose `createLogger()`.
 */
exports = module.exports = createLogger;

/**
 * Create logger
 *
 * @param {object} config
 * @return {Function}
 */
function createLogger(ConfigurationPath, options) {
    var logger = new Logger(ConfigurationPath, options);
    return logger;
}

/**
 * The logger class.
 *
 * @param {object} config
 */
function Logger(ConfigurationPath, options) {
    // Grab the options and sort through them
    if (typeof options !== 'undefined' && options) {
        if(typeof options['debug'] !== 'undefined' && options['debug']) {
            debug = true;
            console.log('Extra options detected.');
            console.log('Debug mode on.');
        }
    }

    // Start building the logger.
    if (typeof ConfigurationPath !== 'undefined' && ConfigurationPath) {
        try {
            var configJSON = fs.readFileSync(ConfigurationPath);
            config = JSON.parse(configJSON.toString());
            if(typeof config['settings']['UseEmail'] !== 'undefined' && config['settings']['UseEmail']) {
                email = emailModule.server.connect({ // Used for critical email alerts.
                   user:        config['email']['user'],
                   password:    config['email']['password'],
                   host:        config['email']['host'],
                   port:        config['email']['port'],
                   ssl:         config['email']['ssl']
                });
            }
            if(debug)
                console.log('Genius Logger initialized, configured, and ready to go.');
        } catch (e) {
            console.error('There was an error when reading config.json.');
            if(debug)
                console.log(e.message);
            process.exit(1);
        }

    } else {
        Valid = false;
        console.log('[Genius Logger] Please provide a configuration file for me to munch on.');
        process.exit(1);
    }
}

Logger.prototype.log = function (message) {
    if(Valid) {
        Log(message);
    }
};

Logger.prototype.info = function (message) {
    if(Valid) {
        Log('[INFO] ' + message);
    }
};

Logger.prototype.warning = function (message) {
    if(Valid) {
        Log('[WARNING] ' + message);
    }
};

Logger.prototype.error = function (message) {
    if(Valid) {
        Log('[ERROR] ' + message);
    }
};

Logger.prototype.critical = function (message) {
    if(Valid) {
        Log('[CRITICAL] ' + message);

        // Start the process for emailing the administrators if option is enabled
        if(typeof config['settings']['EmailAdminsOnCritical'] !== 'undefined') {
            if(config['settings']['EmailAdminsOnCritical']) {
                if(debug)
                    console.log('There was a critical error. Emailing administrators now.')
                var Text_Template = 'This is an automated message from the Genius Logger package.\n\nProduct: ' + config['ProductName'] + '\nError Level: Critical\nMessage:\n' + message;
                var HTML_Template = '<i>This is an automated message from Genuis Logger package.</i><br/><br/><b>Product:</b> ' + config['ProductName'] + '<br/><b>Error Level:</b> Critical<br/><b>Message:</b><br/><code>' + message + '</code>';
                config['administrators'].forEach(function(admin){
                    if(debug)
                        console.log('Sending email to ' + admin['name'] + ' at the email address ' + admin['email'] + '.');
                    email.send({
                        text:    Text_Template,
                        from:    config['email']['name'] + "<" + config['email']['user'] + ">",
                        to:      admin['name'] + " <" + admin['email'] + ">",
                        subject: "Genius Logger - Critical Error on " + config['ProductName'],
                        attachment:
                        [
                              {data:HTML_Template, alternative:true}
                        ]
                    }, function(err, message) {
                        if(debug) {
                            if(err) {
                                console.log('There was an error when sending the email to ' + admin['email']);
                                console.log(err);
                            } else {
                                console.log('Email has been sent to ' + admin['name'] + ' <' + admin['email'] + '>.');
                            }
                        }
                    });
                });
            }
        }
    }
};

/**
 * Handle all the messages from the Logger class.
 */
function Log(message) {
    if(Valid) {
        if (typeof config['settings']['UseTimes'] !== 'undefined') {
            if(config['settings']['UseTimes']) {
                if (typeof config['settings']['UseTimes'] !== 'undefined') {
                    if(typeof config['settings']['TimeFormat'] !== 'undefined') {
                        fs.appendFile(config['settings']['LogFile'], moment().format(config['settings']['TimeFormat']) + ' >> ' + message + '\n', function (err) {
                            if(err && debug) {
                                console.log('There was an error when writing to the log file.');
                                console.log(err);
                            }
                        });
                    } else {
                        fs.appendFile(config['settings']['LogFile'], moment().format('YYYY[/]MM[/]DD [@] h[:]mma') + ' >> ' + message + '\n', function (err) {
                            if(err && debug) {
                                console.log('There was an error when writing to the log file.');
                                console.log(err);
                            }
                        });
                    }
                }
            } else {
                fs.appendFile(config['settings']['LogFile'], message + '\n', function (err) {
                    if(err && debug) {
                        console.log('There was an error when writing to the log file.');
                        console.log(err);
                    }
                });
            }
        } else {
            fs.appendFile(config['settings']['LogFile'], message + '\n', function (err) {
                if(err && debug) {
                    console.log('There was an error when writing to the log file.');
                    console.log(err);
                }
            });
        }
    }
}
