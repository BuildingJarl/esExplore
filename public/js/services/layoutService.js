/*
   Ivan Bacher
   C10736831
   ivan.bacher@mydit.ie

   AngularJs service created used angular specified way

*/

angular.module('esExploreApp')
   .service( 'layoutService', function( $q ) {

   	this.create = function( data, clickCallback, hoverCallback ) {

   		var packedSphereTree = new ES_EX.PackedSphereTree( );
   		packedSphereTree.create( data );

   		var ctrl = new ES_EX.PackedSphereCtrl( packedSphereTree, clickCallback, hoverCallback )

   		return ctrl;
   	}

});