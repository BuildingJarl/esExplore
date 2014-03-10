angular.module('esExploreApp')
   .service( 'layoutService', function( $q ) {

   	this.create = function( data, selectCallback ) {

   		var tree = new ES_EX.PackedSphereTree( );
   		tree.create( data );
   		
   		var ctrl = new ES_EX.PackedSphereCtrl( tree, selectCallback )

   		return ctrl;
   	}

});