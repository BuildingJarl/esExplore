var http = require('http');
var jade = require('jade');
var fs = require('fs');
var app = require('./config/express')();
var server = http.createServer(app);

/***  Include all routes (controllers) ***/
fs.readdirSync('./app/routes').forEach(function (file) {
	if(file.substr(-3) === '.js') {
		route = require('./app/routes/' + file);
		route.controller(app);
	}
});

server.listen(app.get('port'), function() {
	console.log("Server started on port " + app.get('port'));	
});