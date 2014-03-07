'use strict';

angular.module('esExploreApp')
  .controller('NavbarCtrl', function ($scope) {
    
    $scope.menu = [{
				title: 'Visualization',
				state: 'visualization',
			},
			{
				title: 'About',
				state: 'about',
			}];
  });
