'use strict'

ES_EX.PackedSphereTree = function() {
	
	var nodes;
	var utils = new ES_EX.PackedSphereTreeUtils();

	this.create = function ( jsonTree ) {

		nodes = utils.calculateLayout( 12000, JSON.parse( jsonTree ) );
		utils.addSpheresToNodes( nodes );
	};

	this.getRoot = function () {
		return nodes[0];
	}

	this.getGLSceneObjects = function() {

		var objects = [];

		for(var i = 0; i < nodes.length; i++) {
			objects.push(nodes[i].sphere.drawObject);
		}

		return objects;
	};

	this.traverse = function( action ) {

		for(var i = 0; i < nodes.length; i ++) {

			var node = nodes[i];
			action(node);
			console.log(node.name);
		}
	};

	this.updateGlow = function( camera ) {
		for(var i = 0; i < nodes.length; i ++) {

			var c = nodes[i].sphere.drawObject;
			c.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, c.position );
		}
	}
};