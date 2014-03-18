angular.module('esExploreApp')
   .directive( 'tooltip', function( $timeout,$document )  {

	return {
		restrict: "A",
		link: function( scope,element,attrs ) {

			var tooltip = angular.element('<span></span>')
			//element.append(tooltip);
			$document.find('body').eq(0).append(tooltip);

			tooltip.text(attrs.content);
			tooltip.attr('class',attrs.ttclass);

			var bb = element[0].getBoundingClientRect();
			var prom;

			tooltip.css({
				position: 'fixed',
				zIndex: '9999',
				display: 'none'
			})

			element.bind('mouseover', function(event) {
				event.preventDefault()

				prom = $timeout( function(){
					tooltip.css({
						display: 'block'
					});
				},500);
			});

			element.bind('mousemove', function(event) {

				var x = event.clientX + 13;
				var y = event.clientY + 5;

				tooltip.css({
					left: x + 'px',
					top: y + 'px'
				});
			});

			element.bind('mouseout', function() {
				console.log('mouseOut')

				$timeout.cancel(prom);

				tooltip.css({
					display: 'none'
				});
			});

		}
	}
});