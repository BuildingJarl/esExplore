angular.module('esExploreApp')
   .directive( 'prismDirective', function()  {

	return {
		restrict: "A",
		link: function( scope, element, attrs ) {

			var code = angular.element('<code></code>')
			//code.addClass( 'language-javascript' )

			element.addClass('line-numbers language-javascript prism-directive') 
			element.append(code);

			scope.$watch( 'selectedScope', function() {

				if(!scope.selectedScope)
					return;

				if( scope.selectedScope.name === 'Global Scope' ) {


				} else {

					var sid = scope.selectedScope.sid;
					var fid = scope.selectedScope.fid;

					code.text(scope.files[fid].source);

					Prism.highlightElement(code[0]);
				}

				console.log(scope.selectedScope);
			});

			//scope.selectedScope;
			/*
			function startHighlight( content ) {
			
			var defer = $q.defer();
			var precode = document.getElementById('sourceContainer');
			Prism.highlightElement( precode, true, function() {

				console.log("done");
				defer.resolve();
			});

			return defer.promise;

			file.source
			*/
		}
	}
});
