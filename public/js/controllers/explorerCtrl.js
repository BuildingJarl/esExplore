/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	AngularJs Controller created used angular specified way
	Uses methods provided by angular JS such as emit and broadcast
*/

'use strict';

angular.module('esExploreApp')
	.controller('explorerCtrl', function ( $scope, repositoryService, layoutService, threeService ) {
		
		$scope.showWelcome = true;

		$scope.hideWelcome = function() {
			
			$scope.showWelcome = !$scope.showWelcome;
		}

		$scope.views = {
			explorerMenubar: 'partials/explorerMenubar'
		};

		function clickCallback( data ) {
			
			$scope.$broadcast('threeClickEvent', data );
		};

		function hoverCallback( data ) {
			
			$scope.$broadcast('threeHoverEvent', data );
		};

		$scope.$on('createVisualisation', function( event,data ) {

			$scope.showWelcome = false;
			
			$scope.$broadcast('initSourceViewer');

			var visTree = layoutService.create( data, clickCallback, hoverCallback );

			threeService.stop();
			threeService.addData( visTree );
			threeService.start();
		});
});