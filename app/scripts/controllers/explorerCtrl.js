'use strict';

angular.module('esExploreApp')
	.controller('explorerCtrl', function ( $scope, repositoryService, layoutService, threeService ) {
		
		$scope.views = {
			explorerMenubar: 'partials/explorerMenubar'
		};

		function selectCallback( data ) {
			
			$scope.$broadcast('objectSelected', data );
		};

		$scope.$on('createVisualisation', function( event,data ) {

			$scope.$broadcast('initSourceViewer');

			var visTree = layoutService.create( data, selectCallback );

			threeService.stop();
			threeService.addData( visTree );
			threeService.start();
		});
});