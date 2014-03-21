angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, $q , repositoryService ) {

		$scope.toggle = {
			showFiles: true,
			showCurrent: false,
			showChildren: false,
			showSource: false,
			update: false
		}

		$scope.source = {};
		$scope.source.global = false;

		//get valid files from RepoService
		$scope.$on('initSourceViewer', function( event, data ) {

			$scope.files = repositoryService.getValidFilesForView();		
			
			$scope.toggle.showFiles = true;
			$scope.toggle.showCurrent = true;
			$scope.toggle.showChildren = true;
			$scope.toggle.showSource = true;
		});

		//this gets called everytime the user selects a sphere!
		$scope.$on('objectSelected', function( event, data ) {

			$scope.$apply( function() {

				if(data.type === 'GS') {

					$scope.selectedScope = repositoryService.getGlobalScope();
					
					$scope.source.global = true;

				} else if ( data.type === 'FGS' ) {

					$scope.selectedScope = repositoryService.getFileGlobalScope(data.fid);
					
					$scope.source.global = false;

				} else if ( data.type === 'CS' ) {

					$scope.selectedScope = repositoryService.getChildScope(data.sid);

				}
			});

			$scope.toggle.update = !$scope.toggle.update;
		});
});

		 