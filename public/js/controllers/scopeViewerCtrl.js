/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	AngularJs Controller created used angular specified way
	Uses methods provided by angular JS such as on and apply
*/
'use strict';

angular.module('esExploreApp')
	.controller('scopeViewerCtrl', function( $scope, $q , keyboardStateService,repositoryService ) { 

		$scope.$on('threeHoverEvent', function(event, data) {

			$scope.$apply( function() {
				$scope.hoveredObject = data;
			})
			
		});	

		$scope.showControlsHelp = true;
});
