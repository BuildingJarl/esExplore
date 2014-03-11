'use strict';

ES_EX.SphereScope = function() {

	this.label;
	this.drawObject;

	this.position;

	this.type;
	this.radius;

	this.fid;
	this.sid;

	this.expanded = false;
	this.selected = false;

	this.select = function() {
		
		this.selected = true;
		this.drawObject.getObjectByName('selected').visible = true;
	};

	this.deSelect = function() {
		
		this.selected = false;
		this.drawObject.getObjectByName('selected').visible = false;
	};

	this.updateGlowViewVector = function( camPos ) {

		var newViewVec = new THREE.Vector3().subVectors( camPos, this.position );
		this.drawObject.material.uniforms.viewVector.value = newViewVec	;	
	}
};