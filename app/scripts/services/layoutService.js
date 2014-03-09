angular.module('esExploreApp')
   .service( 'layoutService', function( $q ) {

   	this.create = function( data, selectCallback ) {

   		var tree = new ES_EX.PackedSphereTree( data );
   		tree.create();
   		var ctrl = new ES_EX.PackedSphereCtrl( tree, selectCallback )

   		return ctrl;
   	}

});