/*
	Ivan Bacher
	C10736831
	ivan.bacher@mydit.ie

	AngularJs Directive created used angular specified way
	
	Code is deriinspired form samples on stackoverflow
*/

angular.module('esExploreApp')
	.directive('uploader', function ( fileService, repositoryService ) {
    
    return {
      restrict: 'EA',
      link: function( scope, element, attrs ) {
    
        element.bind("click", function() {
	      
	      element.find("input")[0].click();
	      
	      element.find("input").bind("change",function(event){
            	
            	event.stopPropagation();
				event.preventDefault();	

				for( var i = 0; i < event.target.files.length; i++) {

					fileService.createFile( event.target.files[i] ).then( function( file ) {
						repositoryService.addFile(file);
					});
				}
				//clear input
				element.find("input").val('');
          });
        });
      }
	};
});