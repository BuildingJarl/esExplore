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

			action(nodes[i]);
		}
	};

	this.getNodeById = function( id ) {

		for(var i = 0; i < nodes.length; i++) {
			
			if(nodes[i].sphere.drawObject.id === id) {
				return nodes[i];
			}	
		}
	};
};