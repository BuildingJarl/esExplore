'use strict'

ES_EX.PackedSphereCtrl = function( tree, callback ) {

	this.tree = tree;
	this.sceneObjects = tree.getDrawObjects();
	this.controls;
	this.camera;

	var selectedObj = null;
	var selectedTheta = 0.0;
	var tween;
	var offsetZ = this.sceneObjects[0].scale.z * 4;

	var history = [];
	var historyExpand = [];

	this.init = function( camera, controls, scene ) {

		this.camera = camera,
		this.controls = controls;

		var initalCamPos = new THREE.Vector3( 0, 0, this.sceneObjects[0].scale.x * 2.8 );
		this.camera.position = new THREE.Vector3().copy(initalCamPos);
		
		selectedObj = this.sceneObjects[0];
		selectedObj.userData.selected = true;
		selectedObj.getObjectByName("selected").visible = true;

		history.push(initalCamPos);
	};

	this.update = function( delta ) {

		selectedTheta += delta;
		var scale = Math.sin(selectedTheta) * 5;
		
		for(var i = 0; i < this.sceneObjects.length; i ++) {

			var c = this.sceneObjects[i];
			c.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( this.camera.position, c.position );
			
			if( c.userData.selected ) {

				var sel = c.getObjectByName("selected");

				//sel.scale.x += scale;
				//sel.scale.y += scale;
			}
		}

		if(selectedTheta >= Math.PI * 2) {
			selectedTheta = 0.0;
		}

		TWEEN.update();	
	};

	this.onLeftClick = function( intersects ) {

		if(intersects.length > 0) {
			
			var obj = intersects[0].object;

			callback( obj.userData );

			if( obj != selectedObj ) {

				//reset previous selected objt
				if(selectedObj) {
					selectedObj.userData.selected = false;
					selectedObj.getObjectByName("selected").visible = false;
				}

				//set new selcted object
				selectedObj = obj;
				obj.userData.selected = true;
				obj.getObjectByName("selected").visible = true;
				//-----------------

				//set new controls target pos
				this.controls.target.copy( obj.position );

				var cam = this.camera;

				var oldCamPos = new THREE.Vector3().copy(this.camera.position);

				var newCamPos = new THREE.Vector3();
				newCamPos.x = obj.position.x;
				newCamPos.y = obj.position.y;
				newCamPos.z = obj.position.z + (obj.scale.z * 2.8);

				tween = new TWEEN.Tween( oldCamPos )
					.to( newCamPos, 200 )
					.onUpdate( function() {
						cam.position.x = oldCamPos.x;
						cam.position.y = oldCamPos.y;
						cam.position.z = oldCamPos.z;
					})
					.start();

			} 
			else if( selectedObj === obj ) {

				//expand
				if( !obj.userData.expanded  && obj.userData.children.length != 0 ) {

					selectedObj.userData.selected = false;
					selectedObj.getObjectByName("selected").visible = false;
					
					obj.userData.expanded = true;

					//traverse through children and set new pos for each child
					//this pos is - offset on z axis
					trav(obj, function( child ) {
						child.position.z -= offsetZ;
					});

					//set a new target position for orbit controls
					//x is same, y is same, z - plus offset
					this.controls.target.set( obj.position.x, obj.position.y, obj.position.z - offsetZ );

					//set tween for camera
					var oldCamPos = new THREE.Vector3().copy(this.camera.position);
					var targetPos = new THREE.Vector3();
					targetPos.x = obj.position.x;
					targetPos.y = obj.position.y;
					targetPos.z = (obj.position.z - offsetZ) + (obj.scale.z * 3);
					
					history.push( targetPos );
					historyExpand.push( obj );

					var cam = this.camera;

					tween = new TWEEN.Tween( oldCamPos )
						.to( targetPos, 200 )
						.onUpdate( function() {
							cam.position.x = oldCamPos.x;
							cam.position.y = oldCamPos.y;
							cam.position.z = oldCamPos.z;
						})
						.start();

					selectedObj = null;
				}
			} 
		}
	};

	this.onRightClick = function() {
		
		//go back to overview position
		if(selectedObj != null) {

			var currentPosition = new THREE.Vector3().copy(this.camera.position);
			var targetPosition = new THREE.Vector3().copy(history[history.length-1]);
			var cam = this.camera;

			this.controls.target.set( targetPosition.x, targetPosition.y, selectedObj.position.z );

			tween = new TWEEN.Tween( currentPosition )
				.to( targetPosition, 200 )
				.onUpdate( function() {
					cam.position.x = currentPosition.x;
					cam.position.y = currentPosition.y;
					cam.position.z = currentPosition.z;
				})
				.start();


			if( history.length > 1) {
				selectedObj.userData.selected = false;
				selectedObj.getObjectByName("selected").visible = false;
				selectedObj = null;	
			}
		}

		//rollback Expand
		else if(selectedObj === null) {
			if(historyExpand.length > 0) {

				var parentObj = historyExpand.pop();
				history.pop();

				var currentPosition = new THREE.Vector3().copy(this.camera.position);
				var targetPosition = new THREE.Vector3().copy(history[history.length-1]);
				var cam = this.camera;
				var con = this.controls;

				tween = new TWEEN.Tween( currentPosition )
					.to( targetPosition, 300 )
					.onUpdate( function() {
						cam.position.x = currentPosition.x;
						cam.position.y = currentPosition.y;
						cam.position.z = currentPosition.z;
					})
					.onComplete(function() {

						if(history.length == 1) {
							selectedObj = parentObj;	
							selectedObj.userData.selected = true;
							selectedObj.getObjectByName("selected").visible = true;	
						}

						trav(parentObj, function( child ) {
					
							child.position.z += offsetZ;
						});
						con.target.set( targetPosition.x, targetPosition.y, parentObj.position.z );
					})
					.start();



				parentObj.userData.expanded = false;

			}
		}

	};

	this.onHover = function( intersects ) {
		
		if(intersects.length > 0) {
			
			var obj = intersects[0].object;


		}
	};

	function trav( obj, func ) {
		for(var i = 0; i < obj.userData.children.length; i ++) {

			var child = obj.userData.children[i];
			func(child);
			trav(child, func);
		}
	};
};