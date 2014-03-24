angular.module('esExploreApp')
	.controller('scopeViewerCtrl', function( $scope, $q , keyboardStateService,repositoryService ) { 

		$scope.$on('threeHoverEvent', function(event, data) {

			$scope.$apply( function() {
				$scope.hoveredObject = data;
			})
			
		});	

		$scope.showControlsHelp = true;
});
