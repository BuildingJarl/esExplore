'use strict';

angular.module('esExploreApp', [
	'ui.router',
	'mgcrea.ngStrap.modal',
	'mgcrea.ngStrap.aside'
	]);

angular.module('esExploreApp')
	.config(function($stateProvider,$urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'partials/home',
				controller: 'HomeCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'partials/about',
				controller: 'AboutCtrl'
			})
			.state('visualization', {
				url: '/visualization',
				templateUrl: 'partials/visualization',
				controller: 'VisualizationCtrl'
			})
			.state('visualization.explore', {
				url: '/visualization',
				templateUrl: 'partials/visualizationExplore',
				controller: 'VisualizationExploreCtrl'
			})
			.state('visualization.detail', {
				url: '/visualization',
				templateUrl: 'partials/visulizationDetail',
				controller: 'VisualizationDetailCtrl'
			});
	});