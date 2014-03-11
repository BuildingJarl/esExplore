'use strict';

angular.module('esExploreApp')
	.controller('visualisationCtrl', function ( $scope, repositoryService, layoutService ) {
		
		$scope.viewSelection = "explore"; 
		$scope.showCreate = false;
		$scope.showSettings = false
		$scope.showHelp = false;
		$scope.repo = repositoryService.repo;

		function selectCallback( data ) {
			console.log(data);
		};

		$scope.toggleSlider = function( what ) {

			switch( what ) {

				case 'create': {

					if($scope.showCreate ) {
						$scope.showCreate = false;
					} else {
						$scope.showCreate = true;
					}

					$scope.showSettings = false
					$scope.showHelp = false;
					break;
				};

				case 'settings': {

					if($scope.showSettings ) {
						$scope.showSettings = false;
					} else {
						$scope.showSettings = true;
					}

					$scope.showCreate = false
					$scope.showHelp = false;
					break;
				};

				case 'help': {

					if($scope.showHelp ) {
						$scope.showHelp = false;
					} else {
						$scope.showHelp = true;
					}

					$scope.showCreate = false
					$scope.showSettings = false;
					break;
				};
			}
		};

		$scope.createVisualisation = function() {

			var jsontree = JSON.stringify($scope.repo);
			var visTree = layoutService.create( jsontree, selectCallback );

			$scope.$broadcast('createVis', visTree );
			$scope.toggleSlider('create');
		};

		$scope.changeView = function( what ) {

			if( what === 'explore' ) {
				$scope.viewSelection = "detail";
			} else {
				$scope.viewSelection = "explore";
			}
		}
});