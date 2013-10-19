var expect = require('expect.js'),
		tolerate = require('../index');

describe('Tolerance', function() {

	describe('tolerating a function that behave normally', function() {

		var normal = function(callback) {
			callback(null, 'my result');
		};

		var err, res;

		before(function(done) {

			normal(function(e, r) {
				err = e;
				res = r;
				done();
			});

		});

		it('it should callback as expected', function(done) {

			tolerate(normal, 1000, function(e, r) {
				expect(err).to.eql(e);
				expect(res).to.eql(r);
				done();
			});

		});

	});

	describe('tolerating a function that always callbacks with an error', function() {

		describe('with a timeout of 500 ms', function() {

			var alwaysErr = function(callback) {
				callback(new Error('I always fail!'));
			};

			var err, res;

			before(function(done) {

				alwaysErr(function(e, r) {
					err = e;
					res = r;
					done();
				});

			});

			it('it should callback that error', function(done) {

				tolerate(alwaysErr, 500, function(e, r) {
					expect(err).to.eql(e);
					expect(res).to.eql(r);
					done();
				});

			});

			it('it should callback after the expected time', function(done) {

				var start = new Date();
				tolerate(alwaysErr, 500, function(e, r) {
					var diff = (new Date()).getTime() - start.getTime();
					expect(500 - diff).to.be.within(-5, 5);
					done();
				});

			});

			it('it should have called the passed function more than 2 times', function(done) {

				var count = 0;
				var myFunc = function(callback) {
					count++;
					alwaysErr(callback);
				};

				tolerate(myFunc, 500, function(e, r) {
					expect(count).to.be.within(3, 500);
					done();
				});

			});

		});

		describe('with a timeout of 800 ms and a duration of 100 ms', function() {

			var alwaysErr = function(callback) {
				setTimeout(function() {
					callback(new Error('I always fail!'));
				}, 100);
			};

			var err, res;

			before(function(done) {

				alwaysErr(function(e, r) {
					err = e;
					res = r;
					done();
				});

			});

			it('it should callback that error', function(done) {

				tolerate(alwaysErr, 800, function(e, r) {
					expect(err).to.eql(e);
					expect(res).to.eql(r);
					done();
				});

			});

			it('it should callback after the expected time', function(done) {

				var start = new Date();
				tolerate(alwaysErr, 800, function(e, r) {
					var diff = (new Date()).getTime() - start.getTime();
					expect(800 - diff).to.be.within(-20, 20);
					done();
				});

			});

			it('it should have called the passed function more than 2 times', function(done) {

				var count = 0;
				var myFunc = function(callback) {
					count++;
					alwaysErr(callback);
				};

				tolerate(myFunc, 800, function(e, r) {
					expect(count).to.be.within(3, 8);
					done();
				});

			});

		});

	});

	describe('tolerating a function that first callbacks with an error and after some time it callbacks correctly', function() {

		describe('with a timeout of 500 ms', function() {

			var nowOk = false;

			var beginErr = function(callback) {
				if (nowOk) {
					callback(null, 'everything is nice now');
				} else {
					callback(new Error('I will be fixed shortly!'));
				}
			};

			var err, res;

			beforeEach(function(done) {

				nowOk = false;

				setTimeout(function() {
					nowOk = true;
				}, 200);

				beginErr(function(e, r) {
					err = e;
					res = r;
					done();
				});

			});

			it('it should callback without error', function(done) {

				tolerate(beginErr, 500, function(e, r) {
					expect(err).not.to.eql(e);
					expect(res).not.to.eql(r);
					done();
				});

			});

			it('it should callback after the expected time', function(done) {

				var start = new Date();
				tolerate(beginErr, 500, function(e, r) {
					var diff = (new Date()).getTime() - start.getTime();
					expect(200 - diff).to.be.within(-5, 5);
					done();
				});

			});

			it('it should have called the passed function more than 2 times', function(done) {

				var count = 0;
				var myFunc = function(callback) {
					count++;
					beginErr(callback);
				};

				tolerate(myFunc, 500, function(e, r) {
					expect(count).to.be.within(3, 200);
					done();
				});

			});

		});

		describe('with a timeout of 800 ms and a duration of 50 ms', function() {

			var nowOk = false;

			var beginErr = function(callback) {
				setTimeout(function() {
					if (nowOk) {
						callback(null, 'everything is nice now');
					} else {
						callback(new Error('I will be fixed shortly!'));
					}
				}, 50);
			};

			var err, res;

			beforeEach(function(done) {

				nowOk = false;

				setTimeout(function() {
					nowOk = true;
				}, 300);

				beginErr(function(e, r) {
					err = e;
					res = r;
					done();
				});

			});

			it('it should callback without error', function(done) {

				tolerate(beginErr, 800, function(e, r) {
					expect(err).not.to.eql(e);
					expect(res).not.to.eql(r);
					done();
				});

			});

			it('it should callback after the expected time', function(done) {

				var start = new Date();
				tolerate(beginErr, 800, function(e, r) {
					var diff = (new Date()).getTime() - start.getTime();
					expect(300 - diff).to.be.within(-50, 50);
					done();
				});

			});

			it('it should have called the passed function more than 2 times', function(done) {

				var count = 0;
				var myFunc = function(callback) {
					count++;
					beginErr(callback);
				};

				tolerate(myFunc, 800, function(e, r) {
					expect(count).to.be.within(3, 8);
					done();
				});

			});

		});

	});

	describe('tolerating a function that wants to react differently depending on the errors', function() {

		var what = 'not reached';

		var special = function(callback) {
			if (what) {
				callback(what);
			} else {
				callback(null, 'my result');
			}
		};

		var err, res;

		before(function(done) {

			special(function(e, r) {
				err = e;
				res = r;
				done();
			});

		});

		it('it should react as expected', function(done) {

			what = 'not reached';

			setTimeout(function() {
				what = 'strange error';
			}, 200);

			tolerate(special, 1000,
				function(e) {
					if (e === 'not reached') {
						return true;
					} else {
						return false;
					}
				},
				function(e, r) {
					expect(err).not.to.eql(e);
					expect(e).to.eql('strange error');
					done();
				}
			);

		});

		describe('and after a while callbacks correctly', function() {

			beforeEach(function() {
				what = 'not reached';
			});

			it('it should react as expected', function(done) {

				setTimeout(function() {
					what = null;
				}, 200);

				tolerate(special, 1000,
					function(e) {
						if (e === 'not reached') {
							return true;
						} else {
							return false;
						}
					},
					function(e, r) {
						expect(err).not.to.eql(e);
						expect(res).not.to.eql(r);
						done();
					}
				);

			});

			it('it should callback after the expected time', function(done) {

				setTimeout(function() {
					what = null;
				}, 200);

				var start = new Date();

				tolerate(special, 1000,
					function(e) {
						if (e === 'not reached') {
							return true;
						} else {
							return false;
						}
					},
					function(e, r) {
						var diff = (new Date()).getTime() - start.getTime();
						expect(200 - diff).to.be.within(-5, 5);
						done();
					}
				);

			});

			it('it should have called the passed function more than 2 times', function(done) {

				var count = 0;
				var myFunc = function(callback) {
					count++;
					special(callback);
				};

				setTimeout(function() {
					what = null;
				}, 200);

				tolerate(myFunc, 1000,
					function(e) {
						if (e === 'not reached') {
							return true;
						} else {
							return false;
						}
					},
					function(e, r) {
						expect(count).to.be.within(3, 200);
						done();
					}
				);

			});

		});

	});

});