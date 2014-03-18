'use strict';

angular.module('esExploreApp')
	.controller('explorerMenubarCtrl', function ( $scope, repositoryService ) {
		
		$scope.showCreate = false;
		$scope.showSettings = false
		$scope.showHelp = false;

		$scope.files = repositoryService.repo.files;

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

			$scope.$emit('createVisualisation', JSON.stringify(repositoryService.repo) );
			$scope.toggleSlider('create');
		};

		$scope.resetRepo = function() {

			repositoryService.reset();
			$scope.files = repositoryService.repo.files;
		};
});