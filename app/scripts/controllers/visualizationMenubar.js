'use strict';

angular.module('esExploreApp')
	.controller('VisualizationMenubarCtrl', function ($scope) {
		
		$scope.tooltip = {
			home: { title:'Home' },
			create: { title:'Create' },
			settings: { title:'Settings' },
			help: { title:'Help' }
		};
	});