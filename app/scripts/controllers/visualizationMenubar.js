'use strict';

angular.module('esExploreApp')
	.controller('VisualizationMenubarCtrl', function ($scope) {
		
		$scope.tooltip = {};
		$scope.tooltip.home = { title:'Home'};
		$scope.tooltip.create = ({ title:'Create'});
		$scope.tooltip.settings = ({ title:'Settings'});
		$scope.tooltip.help = ({ title:'Help'});
	});