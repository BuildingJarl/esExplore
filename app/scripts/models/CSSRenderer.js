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

      	renderer.domElement.style.position = "absolute";
      	renderer.domElement.style.top = "0";
      	renderer.domElement.style.bottom = "0";
      	renderer.domElement.style.left = "0";
      	renderer.domElement.style.zIndex = "1";
      	renderer.setSize( width, height );

		container.appendChild( renderer.domElement );
	};

	this.onResize = function( width, height ) {

      	renderer.setSize( width, height );
	};

	this.render = function() {
		
		renderer.render( scene, camera );
	};

	this.clearScene = function() {
		//You need to go back to front, not front to back
		//http://stackoverflow.com/questions/11678497/cant-remove-objects-using-three-js
		for(var i = scene.children.length - 1; i >= 0 ; i --) {

			scene.remove( scene.children[i] );
		}
	};


	this.addObjectsToScene = function( objects ) {

		for(var i = 0; i < objects.length; i++) {
			scene.add(objects[i]);
		}
	};
};