'use strict';

angular.module('esExploreApp')
	.controller('explorerCtrl', function ( $scope, repositoryService, layoutService, threeService ) {
		
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

			$scope.$broadcast('initSourceViewer');

			var visTree = layoutService.create( data, clickCallback, hoverCallback );

			threeService.stop();
			threeService.addData( visTree );
			threeService.start();
		});
});