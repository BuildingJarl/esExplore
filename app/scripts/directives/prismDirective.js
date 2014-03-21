angular.module('esExploreApp')
   .directive( 'prismDirective', function( $timeout )  {

	return {
		restrict: "A",
		link: function( scope, element, attrs ) {

			var code = angular.element('<code></code>')
			var currentFileId = -1;
			var fileHighlightHistory = [];

			//elem.scrollTop = elem.scrollHeight; 


			element.addClass('line-numbers language-javascript prism-directive') 
			element.append(code);

			scope.$watch( 'selectedScope', function() {

				if(!scope.selectedScope)
					return;

				if( scope.selectedScope.name === 'Global Scope' ) {


				} 
				else {

					var sid = scope.selectedScope.sid;
					var fid = scope.selectedScope.fid;

					if( currentFileId != fid ) {

						code.text(scope.files[fid].source);

						Prism.highlightElement(code[0], true, function() {
							currentFileId = fid;
						});

					} else {

						var start = scope.selectedScope.startLoc
						var end = scope.selectedScope.endLoc;

						var span = getLineNrSpan( code.children());
						resetHighlight( span );
						highLightScope( start, end, span );
						element[0].scrollTop = (start-1) * 19;
					}
				}
			});

			function resetHighlight( container ) {

				var children = container.children();

				for( var i = 0; i <= children.length; i++ ) { 
					var child = angular.element(children[i]);
					child.css( { background: 'initial' } );
				}
			}

			function highLightScope( start, end, container ) {

				var children = container.children();

				for( var i = start-1; i <= end-1; i++ ) {

					var child = angular.element(children[i]);
					child.css( { background:'red' } );
				}
			}

			function getLineNrSpan( children ) {

				for (var i = children.length - 1; i >= 0; i--) {
				    	
				    if (children[i].className == 'line-numbers-rows') {
				      	
				      	return(angular.element( children[i] ))
				    }        
				}
			}
		}
	}
});
