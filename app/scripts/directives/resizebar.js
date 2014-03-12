angular.module('esExploreApp')
	.directive('resizebar', function( $document, $window, threeService ) {
		
		return {
			
			restrict: 'A',
			link: function( scope, element, attrs ) {
				
				var x;
				var initialX;
				
				var body = angular.element( document.querySelector( '#explorerViewport' ) );
				var leftSide = angular.element( document.querySelector( '#scopeViewer' ) );
				var rightSide = angular.element( document.querySelector( '#sourceViewer' ) );
				var mover = angular.element('<div> </div>');
				
				//only should be shown on mouse down
				mover .css({
					position: 'absolute',
					top: '0px',
					bottom: '0px',
					width: '5px',
					background: 'blue',
					zIndex: '2',
					display: 'none',
					cursor: 'ew-resize'
				});

				element.css({
					position: 'absolute',
					top:'0px',
					bottom:'0px',
					width: '5px',
					zIndex: '1',
					background: 'green',
					cursor: 'ew-resize'
				});

				//set up initial view 
				element.css({ left:'80%' });

				var resizeBarPos = $window.innerWidth - element.prop('offsetLeft');

				leftSide.css( { right: resizeBarPos + 'px' } );
				rightSide.css( { left: (element.prop('offsetLeft') + 5) + 'px' } );

			
				function mousedown(event) {
					
					event.preventDefault();
					
					x = element.prop('offsetLeft');
					initialX = event.x;
					
					mover.css( { left: x + 'px', display: 'block' } );
					body.append( mover );
				
					$document.bind('mousemove', mousemove);
					$document.bind('mouseup', mouseup);
				}
				
				function mousemove(event) {
					
					event.preventDefault();
					var deltaX = event.x - initialX;
					mover.css({ left: x + deltaX + 'px' } );
					
					
					if(event.x < 0) {
						mover.css({ left: 0 + 'px' } );
						mouseup(event);
					}
					if(event.x > $window.innerWidth-5){
						mover.css({ left: $window.innerWidth - 5 + 'px' } );
						mouseup(event);
					}
				}
				
				function mouseup(event) {
					
					event.preventDefault();
					
					element.css({ left: mover.prop('offsetLeft') + 'px' });
					
					var resizeBarPos = $window.innerWidth - element.prop('offsetLeft');

					leftSide.css( { right: resizeBarPos + 'px' } );
					rightSide.css( { left: (element.prop('offsetLeft') + 5) + 'px' } );
					threeService.onResize();

					mover.css( { display: 'none' } );
					
					$document.unbind('mousemove', mousemove);
					$document.unbind('mouseup', mouseup);
				}
				
				element.bind('mousedown', mousedown);

				angular.element($window).bind ('resize', function( event ) {
		
 				});
		}
	}
});