'use strict';

angular.module('esExploreApp', [
	'ui.router'
]);

angular.module('esExploreApp')
	.config(function($stateProvider,$urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				url: '/',
				templateUrl: 'explorerView',
				controller: 'explorerCtrl'
			});
	});