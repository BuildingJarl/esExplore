angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, $q , repositoryService ) {

		$scope.toggle = {
			showFiles: true,
			showCurrent: false,
			showChildren: false,
			showSource: false,
			update: false
		}

		//get valid files from RepoService
		$scope.$on('initSourceViewer', function( event, data ) {

			$scope.files = repositoryService.getValidFilesForView();		
			$scope.selectedScope = repositoryService.getGlobalScope();

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
					
					resetSelectFile();

				} else if ( data.type === 'FGS' ) {

					$scope.selectedScope = repositoryService.getFileGlobalScope(data.fid);
					
					resetSelectFile();
					selectFile( $scope.selectedScope.fid );

				} else if ( data.type === 'CS' ) {

					$scope.selectedScope = repositoryService.getChildScope(data.sid);
				}
			});

			$scope.toggle.update = !$scope.toggle.update;
		});

		function selectFile( id ) {
			
			$scope.files[id].selected = true;
			console.log($scope.files[id])
		};

		function resetSelectFile() {
		
			for (var key in $scope.files) {
			   
			   var file = $scope.files[key];
			   file.selected = false;  
			}
		};
});

		 