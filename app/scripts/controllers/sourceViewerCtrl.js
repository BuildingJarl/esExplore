angular.module('esExploreApp')
	.controller('sourceViewerCtrl', function( $scope, $q , repositoryService ) {

		$scope.toggle = {
			showFiles: true,
			showCurrent: false,
			showChildren: false,
			showSource: false,
			update: false
		}

		$scope.currentSelectedNameCol = 'inherit';

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
		$scope.$on('threeClickEvent', function( event, data ) {

			$scope.$apply( function() {

				if(data.type === 'GS') {

					$scope.selectedScope = repositoryService.getGlobalScope();
					$scope.currentSelectedNameCol = setColor(data.color);
					console.log($scope.currentSelectedNameCol)
					resetSelectFile();

				} else if ( data.type === 'FGS' ) {

					$scope.selectedScope = repositoryService.getFileGlobalScope(data.fid);
					$scope.selectedScope.color = data.color;
					$scope.currentSelectedNameCol = setColor(data.color);
					
					resetSelectFile();
					selectFile( $scope.selectedScope.fid );

				} else if ( data.type === 'CS' ) {

					$scope.selectedScope = repositoryService.getChildScope(data.sid);
					$scope.selectedScope.color = data.color;
					$scope.currentSelectedNameCol = setColor(data.color);
				}
			});

			$scope.toggle.update = !$scope.toggle.update;
		});

		$scope.$on( 'threeHoverEvent', function( event, data ) {

		});

		function setColor( color ) {
			
			var split = color.split(',');
			return 'rgba( +' + split[0] + ',' + split[1] + ',' + split[2] + ', 0.8)';
		}

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

		 