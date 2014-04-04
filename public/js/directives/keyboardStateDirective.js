/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	AngularJs Directive created used angular specified way
	Binds events to the DOM to listen for keyboard input
*/

'use strict';

angular.module('esExploreApp')
   .directive( 'keyboardStateDirective', function( keyboardStateService, $document )  {

	return {
		restrict: 'A',
		scope:{},
		link: function( scope, element, attrs) {
			

			$document.bind( 'keydown', function( event ){

				//event.preventDefault()
				if(event.which == 32) {
					event.preventDefault()
				}
				keyboardStateService.keydown(event.which);
			});

			$document.bind( 'keyup', function( event ) {

				event.preventDefault()
				keyboardStateService.keyup(event.which);
			});

		}
	}
});