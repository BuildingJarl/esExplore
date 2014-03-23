'use strict';

angular.module('esExploreApp')
	.controller('explorerMenubarCtrl', function ( $scope, repositoryService ) {
		
		$scope.showCreate = false;
		$scope.showHelp = false;
		$scope.showAbout = false;
		$scope.showFeedback = false;

		$scope.createTooltip = 'Create';
		$scope.aboutTooltip = 'About';
		$scope.helpTooltip = 'Help';
		$scope.feedbackTooltip = 'Feedback';

		$scope.files = repositoryService.repo.files;

		$scope.toggleSlider = function( what ) {

			switch( what ) {

				case 'create': {

					$scope.showCreate = !$scope.showCreate ;

					$scope.showHelp = false;
					$scope.showAbout = false;
					$scope.showFeedback = false;
					break;
				};

				case 'help': {

					$scope.showHelp = !$scope.showHelp;

					$scope.showCreate = false;
					$scope.showAbout = false;
					$scope.showFeedback = false;
					break;
				};

				case 'about': {

					$scope.showAbout = !$scope.showAbout;

					$scope.showCreate = false;
					$scope.showHelp = false;
					$scope.showFeedback = false;
					break;
				}

				case 'feedback': {
					$scope.showFeedback = !$scope.showFeedback;

					$scope.showCreate = false;
					$scope.showHelp = false;
					$scope.showAbout = false;
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