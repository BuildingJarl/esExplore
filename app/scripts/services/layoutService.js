angular.module('esExploreApp')
   .service( 'layoutService', function( $q ) {

   	this.create = function( data, selectCallback ) {

   		var packedSphereTree = new ES_EX.PackedSphereTree( );
   		packedSphereTree.create( data );

   		var ctrl = new ES_EX.PackedSphereCtrl( packedSphereTree, selectCallback )

   		return ctrl;
   	}

});