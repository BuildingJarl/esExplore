/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	This files sets up the angular js app
	This is the standard way of setting up an angular app, which can be found in most tutorials
*/

'use strict';

angular.module('esExploreApp', [
	'ui.router'
]);

angular.module('esExploreApp')
	.config(function($stateProvider,$urlRouterProvider) {
		
		/*
			UI Router configuration
		*/

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				url: '/',
				templateUrl: 'explorerView',
				controller: 'explorerCtrl'
			});
	});