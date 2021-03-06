[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Linux Build][travis-image]][travis-url]
## Table of Contents
- [Install](#install)
- [Introduction](#introduction)
- [Configuration](#configuration)
- [Options](#options)
- [Main Logger](#main-logging)
- [Simple Logger](#simple-logging)
- [Email](#email)
- [Todo](#todo)

## Install
```sh
$ npm install genius-logger
```

## Introduction
This specific package is built for node.js applications and is used for a better logging system that is a bit more suited for us here at Bag of Bots.
Instead of using logs generated by systems such as Forever, we use this. It just makes things easier.

Here is an example of how to use the main logger:
```js
var genius = require('genius-logger');

var logger = genius(__dirname + '/config.json');

logger.log('Hello! I\'m a simple log message.');
logger.info('Hey, just so you know. This is an info message.');
logger.error('Whoa, something just went wrong!');
```
Here is an example of how to use the simple logger:
```js
var genius = require('genius-logger');

var simple = genius.simple('name.log');

simple.log('Hello! I\'m a simple log message.');
simple.info('Hey, just so you know. This is an info message.');
simple.error('Whoa, something just went wrong!');
```
Each log message is preceded by a tag telling you what happened. Here's an example of what the output looks like in your log file:
```
2015/12/04 @ 7:02 pm >> Hello! I'm a simple log message.
2015/12/04 @ 7:02 pm >> [INFO] Hey, just so you know. This is an info message.
2015/12/04 @ 7:02 pm >> [ERROR] Whoa, something just went wrong!
```

## Configuration
The logger package uses a json configuaration file that is passed through when you initiate the module.
Here's what a config.json should  look like:
```json
{
    "ProductName": "Example",
    "settings": {
        "LogFile": "my.log",
        "UseTimes": true,
        "TimeFormat": "YYYY[/]MM[/]DD [@] h[:]mma",
        "UseEmail": true,
        "EmailAdminsOnCritical": true
    },
    "email": {
        "name": "Example Email",
        "user": "email@big.com",
        "password": "mysupersecretpassword",
        "host": "stmp.big.com",
        "port": 26,
        "ssl": false
    },
    "administrators": [
        {
            "name": "Joe Big",
            "email": "joe@big.com"
        }
    ]
}
```
### Configuration In Depth
Let's go into the configuration in a bit more depth.
#### ProductName
This is your application name. This will show up mainly in the emails that are sent if you have the emails turned on.
#### LogFile
This is the location and name of the file to log to.
#### UseTimes
If you have this activated a timestamp of the device that is running Genius Logger will be added onto every message logged.
#### TimeFormat
We use [moment.js](http://momentjs.com/) for all our time related features. We will default to the format you've seen if this option is removed. If you would like to come up with your own format and need help, please refer to their documentation on displaying time [here](http://momentjs.com/docs/#/displaying/).
#### Email
I'll go over the email section and the `EmailAdminsOnCritical` here. If `EmailAdminsOnCritical` is turned on and the email section is not filled out properly, Genius Logger **will** fail.
Other than that, the configuration should be straight forward.
#### Administrators
This is just a list of the administrators to email when `EmailAdminsOnCritical` is turned on.

## Options
Along with the configuration file that is passed through, you can also pass through an array of options.

Currently there's only one option.
- [debug](#debug) (off by default)

Building off the example given in the [introduction](#introduction), here's what it would look like with options:
```js
var logger = genius(__dirname + '/config.json', { "debug": true });
```
### Debug
The debug option just enabled information to be logged to the console. It will display information such as:
``Debug mode on.``
``Genius Logger initialized, configured, and ready to go.``
``Email has been sent to Joe Big <joe@big.com>.``

## Main Logging
There are 4 different types of logs you can call on: log, info, warning, error, and critical.
Sadly though, I am restricted because of the fact you can not format text. So things get really interesting with the critical category.
### Logger Log
##### Usage
```js
logger.log('My basic message.');
```
##### Ouput
``2015/12/04 @ 7:02 pm >> My basic message.``

### Logger Info
##### Usage
```js
logger.info('Hey, this is something you should be aware of.');
```
##### Ouput
``2015/12/04 @ 7:02 pm >> [INFO] Hey, this is something you should be aware of.``

### Logger Warning
##### Usage
```js
logger.warning('Whoa, hold up there cowboy!');
```
##### Ouput
``2015/12/04 @ 7:02 pm >> [WARNING] Whoa, hold up there cowboy!``

### Logger Error
##### Usage
```js
logger.error('There seems to be something wrong.');
```
##### Ouput
``2015/12/04 @ 7:02 pm >> [ERROR] There seems to be something wrong.``

### Logger Critical
This is where things get really interesting. If you have the `EmailAdminsOnCritical` turned on then critical will not only log the message, but it will send an email with the same information. An example email is displayed under the output
##### Usage
```js
logger.critical('Something major is going down! Oh crap!');
```
##### Ouput Log
``2015/12/04 @ 7:02 pm >> [CRITICAL] Something major is going down! Oh crap!``
##### Output Email
*This is an automated message from the Genius Logger package.*

**Product:** Example

**Error Level:** Critical

**Message:**

`Something major is going down! Oh crap!`

## Simple Logging

Simple logging is the same as the main logger except in a few points:

 - It does not take a configuration file.
 - It does not email on critical errors.

So how do you use the simple logger? Easy, just call it  like this:
```js
var logger = genius.simple('my.log');
```
That's it! Just like the main logger you can also pass the second parameters for other options. Please refer to [Options](#options) for more information on that.

## Email
Sometimes logging something just doesn't suit your needs as a developer. I know sometimes I just need to send an email for some miscellaneous purpose. So with that, I've decided to create a `logger.email()` function for use. This function requires the `UseEmail` option to be set to `true`. 
__This feature is not included in `genius.simple()`, please do not attempt to use it.__

Now it is kind of tricky to configure. You have to pass an array of options for it to use. The only field that's not *really* required is the `subject` field.
Here is how you can use the email function:
```js
var options = {
        "recipients": [
            {
                "name": "Test User",
                "email": "testuser@big.com"
            }
        ],
        "message": {
            "text": "My awesome email.",
            "html": "<b>My awesome email.</b>"
        }
};

logger.email(options);

```

## Todo
- Add text messaging support

[npm-image]: https://img.shields.io/npm/v/genius-logger.svg
[npm-url]: https://npmjs.org/package/genius-logger
[node-version-image]: http://img.shields.io/node/v/genius-logger.svg
[node-version-url]: http://nodejs.org/download/
[travis-image]: https://travis-ci.org/MatthewSH/genius-logger.svg?branch=master
[travis-url]: https://travis-ci.org/MatthewSH/genius-logger
[downloads-image]: https://img.shields.io/npm/dm/genius-logger.svg
[downloads-url]: https://npmjs.org/package/genius-logger

