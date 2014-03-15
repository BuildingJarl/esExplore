angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, repositoryService ) {

		$scope.showFiles = true;
		$scope.showCurrent = true;
		$scope.showChildren = true;
		$scope.showSource = true;

		$scope.files = [];
		$scope.selectedScope = {};

		$scope.source = {};
		$scope.source.global = true;
		/* id: {show:true/false, source: escodegen , start: int, end: int */

		//get valid files from RepoService
		$scope.$on('initSourceViewer', function( event, data ) {

			$scope.files = repositoryService.getValidFilesForView();
			$scope.selectedScope = repositoryService.getGlobalScope();
		});

		//this gets called everytime the user selects a sphere!
		$scope.$on('objectSelected', function( event, data ) {

			$scope.$apply( function() {

				if(data.type === 'GS') {

					$scope.selectedScope = repositoryService.getGlobalScope();
					
					resetShowSource();
					$scope.source.global = true;

				} else if ( data.type === 'FGS' ) {

					$scope.selectedScope = repositoryService.getFileGlobalScope(data.fid);
					
					resetShowSource();
					$scope.source.global = false;
					showSource( data.fid )

				} else if ( data.type === 'CS' ) {

					$scope.selectedScope = repositoryService.getChildScope(data.sid);

					//resetShowSource();

				}
			});
			console.log($scope.selectedScope);
		});

		function resetShowSource() {
			for(var i = 0; i < $scope.files.length; i++) {
				$scope.files[i].showSource = false;
			}
		}

		function showSource( id ) {

			for(var i = 0; i < $scope.files.length; i++) {
				
				if($scope.files[i].id === id) {
					$scope.files[i].showSource = true;
				}
			}
		}

});

		 