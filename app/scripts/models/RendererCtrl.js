'use strict'

ES_EX.RendererCtrl = function( ) {

	var glRenderer = new ES_EX.GLRenderer();
	var cssRenderer = new ES_EX.CSSRenderer();
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

		glRenderer.init( container, camera );
		cssRenderer.init( container, camera );

		if( debug ) {

	    	stats = new Stats();
	    	stats.domElement.style.top = "0px";
	    	stats.domElement.style.position = "absolute";
	    	container.appendChild( stats.domElement );
      	}
	};

	this.addTreeCtrl = function( ctrl ) {

		treeCtrl = ctrl;
		treeCtrl.init( camera,controls);

		glRenderer.clearScene();
		glRenderer.addObjectsToScene( treeCtrl.sceneObjects );
	};

	this.start = function() {

		var self = this;
		console.log("starting loop");

		render();

		function render( ) {

			frameid = requestAnimationFrame( render );

			if( stats ) {
	        	stats.update();
	    	}
	     	glRenderer.render();
	     	cssRenderer.render();
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
		cssRenderer.onResize( newWidth, newHeight );

		console.log( "Renderers resized to: " + newWidth + " X " + newHeight );
	};

	this.onLeftClick = function( event ){
		
		event.preventDefault();

		var intersects = glRenderer.intersects( event.clientX, event.clientY-40, container.clientWidth, container.clientHeight );

		if(treeCtrl) {
			treeCtrl.onLeftClick( intersects );
		}
	};

	this.onRightClick = function( event ){

		treeCtrl.onRightClick();
	};

	function update() {

		if( treeCtrl ) {
			treeCtrl.update();
		}
	};

};