angular.module('esExploreApp')
   .service( 'threeService', function( $q ) {

      var rendererCtrl = new ES_EX.RendererCtrl();
      var treeCtrl;
      var procideEvents = true;

      this.init = function( element, debug ) {
        
         rendererCtrl.init( element, debug );
      };

      this.stopEvents = function() {

         procideEvents = false;
         rendererCtrl.stopControls();
         if(treeCtrl) 
            treeCtrl.hideLabel();
      };

      this.startEvents = function() {

         procideEvents = true;
         rendererCtrl.startControls();

         if(treeCtrl) 
            treeCtrl.showLabel();      
      }

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

         if( procideEvents ) {

            rendererCtrl.onLeftClick(event);
         }
      };

      this.onRightClick = function(event){

         if( procideEvents ) { 

            rendererCtrl.onRightClick(event);
         } 
      };

      this.onHover = function( event ) {
         
         if( procideEvents ) { 

            rendererCtrl.onHover(event);
         }
      };

   	this.addData = function( data ) {

         treeCtrl = data;
   		rendererCtrl.addTreeCtrl( data );
   	};
      
   });