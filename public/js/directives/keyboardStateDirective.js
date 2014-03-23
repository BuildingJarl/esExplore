angular.module('esExploreApp')
   .directive( 'keyboardStateDirective', function( keyboardStateService, $document )  {

	return {
		restrict: 'A',
		scope:{},
		link: function( scope, element, attrs) {
			

			$document.bind( 'keydown', function( event ){

				//event.preventDefault()
				keyboardStateService.keydown(event.which);
			});

			$document.bind( 'keyup', function( event ) {

				event.preventDefault()
				keyboardStateService.keyup(event.which);
			});

		}
	}
});