'use strict';

angular.module('esExploreApp')
	.controller('exploreCtrl', function ( $scope, visEnvService ) {

		$scope.$on('createVis', function( event, tree ){

			visEnvService.stop();
			visEnvService.addTree( tree );
			visEnvService.start();
		});
});