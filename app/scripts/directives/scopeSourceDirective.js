angular.module('esExploreApp')
   .directive( 'scopeSourceDirective', function( $timeout, threeService, keyboardStateService, repositoryService )  {

	return { 
		restrict: 'A',
		link: function( scope, element, attr ) {

			var backdrop = angular.element( '<div></div>' );
			var displayPanel = angular.element('<div> </div>');

			var pre = angular.element( '<pre></pre>' );
			var code = angular.element( '<code></code>' );

			backdrop.addClass( 'backdrop' );
			displayPanel.addClass( 'displayPanel' );

			pre.append(code);
			displayPanel.append(pre);
			backdrop.append( displayPanel );

			backdrop.css( { display: 'none' } );

			element.append( backdrop );

			scope.isKeyDown = false;
			scope.isHover = false;

			keyboardStateService.bindCallback( 'ctrl', function( key ) {

				scope.isKeyDown = key.isDown;

				show();
			});

			scope.$watch( 'hoveredObject', function( oldObj, newObj ) {

				if( !scope.hoveredObject) 
					return

				scope.isHover = scope.hoveredObject.hover;
			});

			function show() {

				if( scope.isHover && scope.isKeyDown ) {

					threeService.stopEvents();
					
					var what = scope.hoveredObject.data.type;
					var fid = scope.hoveredObject.data.fid
					var sid = scope.hoveredObject.data.sid

					if( what === 'GS' ) {

					} 
					else {
						var startLineNr = repositoryService.repo.scopeSet[sid].startLoc;
						var endLineNr = repositoryService.repo.scopeSet[sid].endLoc;
						var source = repositoryService.repo.filesSet[fid].getSourceFromTo( startLineNr, endLineNr );

						code.text(source);
					}



					backdrop.css( { display: 'block' } );
				} else {

					
					backdrop.css( { display: 'none' } );
					threeService.startEvents();
				}
			};
		}
	};
});