/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	This controller is responsibe for handling get requests
*/
module.exports.controller = function(app){

	app.get('/', function (req, res) {
		res.render("index");
	});

	app.get('/explorerView', function ( req, res ){
		res.render('partials/explorerView');
	});
};