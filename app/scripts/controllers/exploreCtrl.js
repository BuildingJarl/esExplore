'use strict';

angular.module('esExploreApp')
	.controller('exploreCtrl', function ( $scope, visEnvService ) {

		$scope.$on('createVis', function( event, data ){

			visEnvService.stop();
			visEnvService.addCtrl( data );
			visEnvService.start();
		});
});