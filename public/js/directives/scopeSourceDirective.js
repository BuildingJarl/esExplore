angular.module('esExploreApp')
   .directive( 'scopeSourceDirective', function( $timeout, threeService, keyboardStateService, repositoryService )  {

	return { 
		restrict: 'A',
		link: function( scope, element, attr ) {

			var backdrop = angular.element( '<div></div>' );
			var displayPanelContainer = angular.element('<div></div>');
			var displayPanel = angular.element('<div></div>');

			var pre = angular.element( '<pre></pre>' );
			var code = angular.element( '<code></code>' );

			var currentHovered = { what : undefined, fid: undefined, sid: undefined };

			backdrop.addClass( 'backdrop' );
			displayPanelContainer.addClass( 'displayPanelContainer' );
			displayPanel.addClass( 'displayPanel' );

			pre.addClass( 'language-javascript line-numbers' )

			pre.append(code);
			displayPanel.append(pre);
			displayPanelContainer.append( pre );

			displayPanelContainer.css( { display: 'none' } );
			backdrop.css( { display: 'none' } );

			element.append( displayPanelContainer );
			element.append( backdrop );

			scope.isKeyDown = false;
			scope.isHover = false;

			keyboardStateService.bindCallback( 'space', function( key ) {

				scope.isKeyDown = key.isDown;

				show();

				if( !scope.isKeyDown )
					currentHovered = { what : undefined, fid: undefined, sid: undefined };
			});

			scope.$watch( 'hoveredObject', function( oldObj, newObj ) {

				if( !scope.hoveredObject) 
					return

				scope.isHover = scope.hoveredObject.hover;

				if(scope.isHover) {
					element.css( { cursor: 'pointer' });
				} else {
					element.css( { cursor: 'default' });
				}
			});

			function stillSameObjectHovered() {

				if( currentHovered.fid === scope.hoveredObject.data.fid &&
					currentHovered.sid === scope.hoveredObject.data.sid &&
					currentHovered.what === scope.hoveredObject.data.type )
					return true
				else
					return false
			}

			function show() {

				if( scope.isHover && scope.isKeyDown ) {

					if( stillSameObjectHovered() )
						return

					element.css( { cursor: 'default' });
					threeService.stopEvents();

					currentHovered.what = scope.hoveredObject.data.type;
					currentHovered.fid = scope.hoveredObject.data.fid
					currentHovered.sid = scope.hoveredObject.data.sid

					if( currentHovered.what === 'GS' ) {
						code.text('');
					} 
					else {
						var startLineNr = repositoryService.repo.scopeSet[currentHovered.sid].startLoc;
						var endLineNr = repositoryService.repo.scopeSet[currentHovered.sid].endLoc;
						var source = repositoryService.repo.filesSet[currentHovered.fid].getSourceFromTo( startLineNr, endLineNr );

						pre.attr( 'data-start',startLineNr);
						code.text(source);

						Prism.highlightElement(code[0], true, function() {
						});
					}


					displayPanelContainer.css( { display: 'block' } );
					backdrop.css( { display: 'block' } );
				} else {

					displayPanelContainer.css( { display: 'none' } );
					backdrop.css( { display: 'none' } );
					threeService.startEvents();
				}
			};
		}
	};
});