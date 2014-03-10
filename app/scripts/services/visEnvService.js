angular.module('esExploreApp')
   .service( 'visEnvService', function( $q ) {

      var rendererCtrl = new ES_EX.RendererCtrl();

      this.init = function( element, debug ) {
        
         rendererCtrl.init( element, debug );
      };

   	this.start = function() {

   		rendererCtrl.start();
   	};

   	this.stop = function() {

   		rendererCtrl.stop();
   	};

      this.onResize = function(){

         rendererCtrl.onResize();
      };

      this.onLeftClick = function(event){

         rendererCtrl.onLeftClick(event);
      };

      this.onRightClick = function(event){

         rendererCtrl.onRightClick(event);
      };

   	this.addCtrl = function( ctrl ) {

   		rendererCtrl.addTreeCtrl(ctrl);
   	}
   });