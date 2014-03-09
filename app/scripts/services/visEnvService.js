angular.module('esExploreApp')
   .service( 'visEnvService', function( $q ) {

   	this.glRenderer = new ES_EX.GLRenderer();

   	this.start = function() {

   		this.glRenderer.start();
   	}

   	this.stop = function() {

   		this.glRenderer.stop();
   	}

   	this.addCtrl = function( ctrl ) {

   		console.log(ctrl);
   		this.glRenderer.addCtrl(ctrl);
   	}


   });