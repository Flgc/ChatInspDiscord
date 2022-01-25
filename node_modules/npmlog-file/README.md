npmlog-file
===========

[![Build Status](https://travis-ci.org/tjwebb/npmlog-file.svg?branch=master)](https://travis-ci.org/tjwebb/npmlog-file)

Easily write npmlog output to a file in the same format as it logs to the screen

## Install
```sh
$ npm install --save npmlog-file
```

## Usage
```js
var log = require('npmlog');
var logfile = require('npmlog-file')

// write everything npmlog has logged thus far to log.txt
logfile.write(log, 'log.txt');

```
