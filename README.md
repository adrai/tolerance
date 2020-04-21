**The world needs more TOLERANCE!!!**

# Introduction

[![Build Status](https://secure.travis-ci.org/adrai/tolerance.png)](http://travis-ci.org/adrai/tolerance)
[![Actions](https://github.com/adrai/tolerance/workflows/node/badge.svg)](https://github.com/adrai/tolerance/actions?query=workflow%3Anode)

Tolerance is a node.js module that wraps a function with retry functionality by passing a timeout. So the function will be more tolerant.

You can use it for example if you want to connect to a database that is not running immediately...

# Installation

    $ npm install tolerance

# Usage

	var tolerate = require('tolerance');

	tolerate(
		function(callback) {
			db.connect(callback);
		},
		1500,
		function(err, res) {
			// If the db comes up after 800 ms
			// this callback will be called as the connection
			// would have been established immediately.
			//
			// If the db does not come up within the 1500 ms
			// this callback will be called with the appropriate error.
			//
			// In the background 'tolerance' will retry to connect to the db.
		}
	);


## Use own retry indication

	var tolerate = require('tolerance');

	tolerate(
		function(callback) {
			db.connect(callback);
		},
		1500,
		function(err) { // should return true if you want to trigger a retry...
			if (err === 'not reached') {
				return true;
			} else {
				return false;
			}
		},
		function(err, res) {
			// If the db comes up after 800 ms
			// this callback will be called as the connection
			// would have been established immediately.
			//
			// If the db does not come up within the 1500 ms
			// this callback will be called with the appropriate error.
			//
			// In the background 'tolerance' will retry to connect to the db.
		}
	);
