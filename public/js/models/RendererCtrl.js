'use strict'

ES_EX.RendererCtrl = function( ) {

	var glRenderer = new ES_EX.GLRenderer();
	var container;
	var stats
	var camera;
	var controls;
	var frameid;
	var treeCtrl;

	this.init = function( ccontainer, debug ) {
		
		container = ccontainer;

		var width = container.clientWidth;
		var height = container.clientHeight;

		camera = new THREE.PerspectiveCamera( 45, width/height, 0.1, 150000);
		
		controls = new THREE.OrbitControls( camera, container );
      	controls.noPan = true; 
      	controls.noRotate = false;

		glRenderer.init( container, camera );
		
		if( debug ) {

	    	stats = new Stats();
	    	stats.domElement.style.top = "0px";
	    	stats.domElement.style.position = "absolute";
	    	stats.domElement.style.zIndex = "1";
	    	container.appendChild( stats.domElement );
      	}
	};

	this.stopControls = function() {
		
		controls.enabled = false;
	};

	this.startControls = function() {

		controls.enabled = true;
	};

	this.addTreeCtrl = function( ctrl ) {

		treeCtrl = ctrl;
		treeCtrl.init( camera, controls );

		glRenderer.clearScene();
		glRenderer.addObjectsToScene( treeCtrl.tree.getGLSceneObjects() );
	};

	this.start = function() {

		glRenderer.display();
		var self = this;
		console.log("starting loop");

		render();

		function render( ) {

			frameid = requestAnimationFrame( render );

			if( stats ) {
	        	stats.update();
	    	}
	     	glRenderer.render();
			controls.update();
			update();
		};
	};

	this.stop = function() {

		console.log("Stopping loop");
		
		cancelAnimationFrame( frameid );
	};

	this.onResize = function(){

		var newWidth = container.clientWidth;
		var newHeight = container.clientHeight;
		
		camera.aspect = newWidth/newHeight;
      	camera.updateProjectionMatrix();

		glRenderer.onResize( newWidth, newHeight );

		console.log( "Renderer resized to: " + newWidth + " X " + newHeight );
	};

	this.onLeftClick = function( event ){
		
		event.preventDefault();

		var intersects = glRenderer.intersects( event.clientX, event.clientY-40, container.clientWidth, container.clientHeight );

		if(intersects.length > 0) {
			
			if(treeCtrl) {
				treeCtrl.onLeftClick( intersects );
			}
		}
	};

	this.onRightClick = function( event ){

		treeCtrl.onRightClick();
	};

	this.onHover = function( event ) {

		event.preventDefault();

		var intersects = glRenderer.intersects( event.clientX, event.clientY-40, container.clientWidth, container.clientHeight );

		if(intersects.length > 0) {
			
			if(treeCtrl) {
				treeCtrl.onHover( intersects, event.clientX, event.clientY-40 );
			}
		} else {
			if(treeCtrl) {
				treeCtrl.onHoverOff();
			}
		}
	};

	function update() {

		if( treeCtrl ) {
			treeCtrl.update();
		}
	};

};