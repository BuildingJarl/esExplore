'use strict'

ES_EX.GLRenderer = function( ) {

	var camera;
	var scene;
	var renderer;
	var projector;

	this.init = function( container, ccamera) {

		var width = container.clientWidth;
		var height = container.clientHeight;
		console.log(width + " " + height);
		scene = new THREE.Scene();
	    camera = ccamera;
	    renderer = new THREE.WebGLRenderer( {antialias: true } );
	    renderer.sortObjects = false;
	    
	    projector = new THREE.Projector();

      	renderer.domElement.style.position = "absolute";
      	renderer.domElement.style.top = "0";
      	renderer.domElement.style.bottom = "0";
      	renderer.domElement.style.left = "0";
      	renderer.domElement.style.zIndex = "0";
      	renderer.setSize( width, height );

		container.appendChild( renderer.domElement );

      	renderer.setClearColor(0x120712, 1);
      	renderer.render( scene, camera );
	};

	this.onResize = function( width, height ) {

      	renderer.setSize( width, height );
	};

	this.intersects = function( x1, y1, x2, y2 ) {

		var x = ( x1 / x2  ) * 2 - 1;
		var y = - ( y1 / y2 ) * 2 + 1;
		var z = 0.5;

		var vector = new THREE.Vector3(x,y,z);
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( scene.children );

		return intersects;
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
		//sort order in off so add inner objects first
		for(var i = objects.length -1 ; i >= 0; i--) {

			scene.add(objects[i]);
		}
	};
};