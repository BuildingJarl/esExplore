'use strict'

ES_EX.CSSRenderer = function( ) {

	var camera;
	var scene;
	var renderer;

	this.init = function( container, ccamera, debug ) {

		var width = container.clientWidth;
		var height = container.clientHeight;

		scene = new THREE.Scene();
	    camera = ccamera;
	    renderer = new THREE.CSS3DRenderer();

      	renderer.domElement.style.display = "block";
      	renderer.domElement.style.position = "absolute";
      	renderer.domElement.style.top = "0";
      	renderer.setSize( width, height );

		container.appendChild( renderer.domElement );
	};

	this.onResize = function( width, height ) {

      	renderer.setSize( width, height );
	};

	this.render = function() {
		
		renderer.render( scene, camera );
	};
};