angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, repositoryService ) {

		$scope.files = [{name:''}];
		$scope.selectedScope = {};

		//get valid files from RepoService
		$scope.$on('initSourceViewer', function( event, data ) {

			$scope.files = repositoryService.getValidFilesForView();
			$scope.selectedScope = repositoryService.getGlobalScope();
			
			console.log("init source viwer");
		});

		//this gets called everytime the user selects a sphere!
		$scope.$on('objectSelected', function( event, data ) {

			$scope.$apply( function() {

				if(data.type === 'GS') {

					$scope.selectedScope = repositoryService.getGlobalScope();

				} else if ( data.type === 'FGS' ) {

					$scope.selectedScope = repositoryService.getFileGlobalScope(data.fid);

				} else if ( data.type === 'CS' ) {

					$scope.selectedScope = repositoryService.getChildScope(data.sid);

				}
			});
			console.log($scope.selectedScope);

		});

});

		 