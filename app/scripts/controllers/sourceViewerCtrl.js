angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, repositoryService ) {

		$scope.toggle = {
			showFiles: true,
			showCurrent: false,
			showChildren: false,
			showSource: false,
			update: false
		}

		$scope.files = [];
		$scope.selectedScope = {};

		$scope.source = {};
		$scope.source.global = false;

		/* id: {show:true/false, source: escodegen , start: int, end: int */

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

			$scope.toggle.update = !$scope.toggle.update;

			//Prism.highlightAll();

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

		 