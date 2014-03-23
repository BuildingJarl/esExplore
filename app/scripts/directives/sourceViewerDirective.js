angular.module('esExploreApp')
   .directive( 'sourceViewerDirective', function( $window, $timeout )  {

	return {
		restrict: "A",
		link: function( scope, element, attrs ) {

			var children = element.children();
			var panel = angular.element( children[children.length - 1] );
			var containerHeight = element[0].getClientRects()[0].height;

			scope.$watch( 'toggle', function() {

				var newHeight = containerHeight;

				for(var i = 0; i < children.length-1; i ++) {

					var child = children[i];
					newHeight -= child.getClientRects()[0].height
				}	
				
				panel.css({ height: newHeight-2 + 'px' })
			},true);

			angular.element($window).bind('resize', function(event) {

				$timeout(function() {

					containerHeight = element[0].getClientRects()[0].height;
				
					var newHeight = containerHeight;

					for(var i = 0; i < children.length-1; i ++) {

						var child = children[i];
						newHeight -= child.getClientRects()[0].height
					}	
					
					panel.css({ height: newHeight-2 + 'px' })
				}, 50);
			});
		}
	}
});
