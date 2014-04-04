/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	AngularJs Directive created used angular specified way
	Uses methods provided by angular JS for DOM manipulations
*/

'use strict';

angular.module('esExploreApp')
	.directive('explorerViewport', function( $document, $window, threeService ) {
		
		var template =	'<div id="scopeViewer" three></div>' +
						'<div id="sourceViewer"><p>testtesttest</p></div>';

		return {
			
			restrict: 'A',
			link: function( scope, element, attrs ) {

				var x;
				var initialX;

				var minRight = 450;
				var maxRight = 800;

				var lastWinSize = { 
					w: $document[0].documentElement.clientWidth, 
					h: $document[0].documentElement.clientHeight 
				};

				var leftSide = angular.element(element.children()[0]);
				var rightSide = angular.element(element.children()[1]);

				var resizebar = angular.element('<div id="resizebar"> </div>');
				var resizebarActive = angular.element('<div id="resizebarActive"> </div>');
				
				resizebar.css({ left: lastWinSize.w - minRight + 'px' });
				
				//angular element
				element.append(resizebar);
				element.append(resizebarActive);

				var leftSidePos = lastWinSize.w - resizebar.prop('offsetLeft');
				var rightSidePos = resizebar.prop('offsetLeft') + 5;

				leftSide.css( { right: leftSidePos + 'px' } );
				rightSide.css( { left: rightSidePos + 'px' } );
				threeService.onResize();
				
				function mousedown( event ) {
					
					event.preventDefault();
					
					x = resizebar.prop('offsetLeft');
					initialX = event.clientX;
					
					resizebarActive.css( { left: x + 'px', display: 'block' } );

					$document.bind('mousemove', mousemove);
					$document.bind('mouseup', mouseup);
				};

				function mousemove(event) {
					
					event.preventDefault();

					var deltaX = event.clientX - initialX;
					var newPos = x + deltaX;
						
					var newRight = lastWinSize.w - newPos;

					if( newRight <= maxRight && newRight >= minRight ) {
						resizebarActive.css( { left: newPos + 'px' } );	
					} else {
						//mouseup(event);
					}			
				};
				
				function mouseup(event) {
					
					event.preventDefault();
					
					resizebar.css({ left: resizebarActive.prop('offsetLeft') + 'px' });
					resizebarActive.css( { display: 'none' } );

					var leftSidePos = lastWinSize.w - resizebar.prop('offsetLeft');
					var rightSidePos = resizebar.prop('offsetLeft') + 5;

					leftSide.css( { right: leftSidePos + 'px' } );
					rightSide.css( { left: rightSidePos + 'px' } );
					threeService.onResize();

					$document.unbind('mousemove', mousemove);
					$document.unbind('mouseup', mouseup);
				};
			
				resizebar.bind('mousedown', mousedown);

				angular.element($window).bind('resize', function( event ) {

					var offset = lastWinSize.w - $document[0].documentElement.clientWidth;

					lastWinSize.w = $document[0].documentElement.clientWidth;
					lastWinSize.h = $document[0].documentElement.clientHeight;

					resizebar.css({ left: (resizebar.prop('offsetLeft') - offset ) + 'px' });

					var leftSidePos = lastWinSize.w - resizebar.prop('offsetLeft');
					var rightSidePos = resizebar.prop('offsetLeft') + 5;

					leftSide.css( { right: leftSidePos + 'px' } );
					rightSide.css( { left: rightSidePos + 'px' } );
					threeService.onResize();
				});
		}
	}
});