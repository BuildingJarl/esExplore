'use strict'

ES_EX.PackedSphereCtrl = function( tree, callback ) {

	this.tree = tree;

	var controls;
	var camera;

	var selectedNode = null;
	var selectedTheta = 0.0;
	var offsetZ =  10000;

	var history = [];
	var historyExpand = [];

	this.init = function( ccamera, ccontrols ) {

		camera = ccamera,
		controls = ccontrols;

		var root = this.tree.getRoot();

		var initalCamPos = new THREE.Vector3( 0, 0, root.r * 2.8 );
		camera.position = new THREE.Vector3().copy(initalCamPos);
		
		selectedNode = root;
		selectedNode.select();

		history.push(initalCamPos);
	};

	this.update = function( delta ) {

		this.tree.traverse( function( node ) {

			node.updateGlowViewVector( camera.position )
		});

		TWEEN.update();	
	};

	this.onLeftClick = function( intersects ) {

		if(intersects.length > 0) {
			
			var intersectedObj = intersects[0].object;
			console.log(intersectedObj);

			//Check if a new node has been selected
			//if new obj
			if( intersectedObj.id != selectedNode.doid  ) {

				//Clear selected property of current Selected Node
				selectedNode.deSelect();

				selectedNode = tree.getNodeById(intersectedObj.id);
				selectedNode.select();

				//calc new position/look/orbti point of camera

				var pos = new THREE.Vector3().copy( camera.position );
				var newPos = new THREE.Vector3().copy(selectedNode.position);
				newPos.z += selectedNode.r * 2.8;

				var tween = new TWEEN.Tween( pos )
					.to( newPos, 200 )
					.onUpdate( function() {
						camera.position.x = pos.x;
						camera.position.y = pos.y;
						camera.position.z = pos.z;
					})
					.start();
			} else
			//if same obj has been selected again then its time to go into to sphere 
			if( intersectedObj.id === selectedNode.id ) {

				//if( selectedNode. )
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