angular.module('esExploreApp')
   .directive( 'three', function( $window, threeService )  {

	return {
		restrict: "EA",
		link: function( scope, element, iAttrs ) {

			threeService.init( element[0], true );

			var firstPos = { x:-999, y:-999 };
			//only left button
 			element.bind( "mousedown", function (event) {

 				event.preventDefault();

 				var button = event.which || event.button;

    			if(button == 1) {
    				firstPos = { x:event.clientX, y:event.clientY };
    			}
 			});

 			//only right button
 			element.bind( "mouseup", function (event) {

 				event.preventDefault();

    			if( event.which == 1 || event.button == 1 ) {

    				if( event.clientX == firstPos.x  && event.clientY == firstPos.y ) {
    					threeService.onLeftClick(event);
    				}
    			}
    			if( event.which == 3 || event.button == 2 ) {
    				threeService.onRightClick( event );
    			}
 			});

 			
 			element.bind( "mousemove", function (event) {

 				threeService.onHover(event);
 			});	
		}
	};
});