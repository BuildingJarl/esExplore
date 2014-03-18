'use strict';

angular.module('esExploreApp')
	.controller('explorerMenubarCtrl', function ( $scope, repositoryService ) {
		
		$scope.showCreate = false;
		$scope.showSettings = false
		$scope.showHelp = false;
		$scope.showInfo = false;

		$scope.createTooltip = 'add files';
		$scope.settingsTooltip = 'view settings';
		$scope.infoTooltip = 'view info';
		$scope.helpTooltip = 'view help';

		$scope.files = repositoryService.repo.files;

		$scope.toggleSlider = function( what ) {

			switch( what ) {

				case 'create': {

					$scope.showCreate = !$scope.showCreate ;

					$scope.showSettings = false
					$scope.showHelp = false;
					$scope.showInfo = false;
					break;
				};

				case 'settings': {

					$scope.showSettings = !$scope.showSettings;

					$scope.showCreate = false
					$scope.showHelp = false;
					$scope.showInfo = false;
					break;
				};

				case 'help': {

					$scope.showHelp = !$scope.showHelp;

					$scope.showCreate = false
					$scope.showSettings = false;
					$scope.showInfo = false;
					break;
				};

				case 'info': {

					$scope.showInfo = !$scope.showInfo;

					$scope.showCreate = false;
					$scope.showSettings = false;
					$scope.showHelp = false;
					break;
				}
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