'use strict';

angular.module('esExploreApp')
	.controller('exploreCtrl', function ( $scope, threeService ) {

		$scope.$on('createVis', function( event, data ){

			threeService.stop();
			threeService.addData( data );
			threeService.start();
		});
});