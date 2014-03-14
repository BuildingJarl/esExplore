angular.module('esExploreApp')
   .service( 'repositoryService', function( $q ) {

   this.repo = new ES_EX.Repository();

   this.addFile = function( file ) {

		this.repo.addFile(file);
   };

   this.getValidFilesForView = function() {

   		return this.repo.getValidFiles();
   };

   this.getGlobalScope = function() {

   		return this.repo.getGlobalScope();
   };

});