angular.module('esExploreApp')
   .directive( 'prismDirective', function( $timeout )  {

	return {
		restrict: "A",
		link: function( scope, element, attrs ) {

			var code = angular.element('<code></code>')
			var currentFileId = -1;
			var toglobal = true;

			element.addClass('line-numbers language-javascript prism-directive') 
			element.append(code);

			scope.$watch( 'selectedScope', function() {

				if(!scope.selectedScope)
					return;

				if( scope.selectedScope.name === 'Global Scope' ) {

					code.text('');
					toglobal = true;
				} 
				else {

					var sid = scope.selectedScope.sid;
					var fid = scope.selectedScope.fid;

					if( currentFileId != fid || toglobal == true ) {

						code.text(scope.files[fid].source);

						Prism.highlightElement(code[0], true, function() {
							
							$timeout( function() {

								var start = scope.selectedScope.startLoc
								var end = scope.selectedScope.endLoc;
								var color = scope.selectedScope.color;

								var span = getLineNrSpan( code.children());
								resetHighlight( span );
								highLightScope( start, end, span, color );
								element[0].scrollTop = (start-1) * 19;

							}, 50)

							currentFileId = fid;
						});

						toglobal = false;
					} else {

						var start = scope.selectedScope.startLoc
						var end = scope.selectedScope.endLoc;
						var color = scope.selectedScope.color;

						var span = getLineNrSpan( code.children());
						resetHighlight( span );
						highLightScope( start, end, span, color );
						element[0].scrollTop = (start-1) * 19;
					}
				}
			});

			function resetHighlight( container ) {

				var children = container.children();

				for( var i = 0; i <= children.length; i++ ) { 
					var child = angular.element(children[i]);
					child.css( { backgroundColor: 'initial' } );
					child.find().css( {color: 'initial'} );
				}
			}

			function highLightScope( start, end, container, color ) {

				var children = container.children();
				var split = color.split(',');

				for( var i = start-1; i <= end-1; i++ ) {

					var child = angular.element(children[i]);
					child.css( { backgroundColor: 'rgba( +' + split[0] + ',' + split[1] + ',' + split[2] + ', 0.5)' } );
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
