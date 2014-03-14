angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, repositoryService ) {

		$scope.files = [];

		//get valid files from RepoService
		$scope.$on('initSourceViewer', function( event, data ) {

			$scope.files = repositoryService.getValidFilesForView();
			$scope.selectedScope = repositoryService.getGlobalScope();
			
			console.log("init source viwer");
		});

		//this gets called everytime the user selects a sphere!
		$scope.$on('objectSelected', function( event, data ) {

			console.log(data);
		});

});

		 