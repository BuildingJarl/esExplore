/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	Config for express server
	standard way, as found in most tutorials
*/

var express = require('express');
var path = require('path');

module.exports = function () {
	var app = express();

	var root = path.normalize(__dirname + '/..');

	app.set('port', process.env.PORT || 3000);
	app.set('views', root + '/app/views');
	app.set('view engine', 'jade');

 	app.use(express.logger('dev'));
 	app.use(express.favicon(path.join(root, '/public/img/favicon.ico')));
  	app.use(express.cookieParser('your secret here'));
  	app.use(express.bodyParser());
  	app.use(express.methodOverride());
  	app.use(express.session({ secret: 'keyboard cat' }));
  	app.use(app.router);
  	app.use(express.static(root + '/public'));

  	/***  Development only ***/
	if ('development' === app.get('env')) {
	    app.use(express.errorHandler());
	}

	return app;
}