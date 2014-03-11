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
		console.log(root);
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
			if( selectedNode == null || intersectedObj.id != selectedNode.doid  ) {

				//Clear selected property of current Selected Node
				if(selectedNode) {
					selectedNode.deSelect();
				}
				
				selectedNode = tree.getNodeById(intersectedObj.id);
				selectedNode.select();

				//calc new position/look/orbti point of camera

				controls.target.copy( selectedNode.position );

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
			if( intersectedObj.id === selectedNode.doid ) {

				if( !selectedNode.expanded && selectedNode.canBeExpanded ) {

					selectedNode.deSelect();
					selectedNode.expanded = true;

					selectedNode.traverse( function( child ) {

						child.position.z -= 18000;
					});

					//set new Controlls target pos
					controls.target.copy(selectedNode.position);

					//setTweenForCamera
					var pos = new THREE.Vector3().copy( camera.position );
					var newPos = new THREE.Vector3().copy(selectedNode.position);
					newPos.z += selectedNode.r;
					//targetPos.z = (obj.position.z - offsetZ) + (obj.scale.z * 3);

					history.push( newPos );
					historyExpand.push( selectedNode );

					var tween = new TWEEN.Tween( pos )
						.to( newPos, 200 )
						.onUpdate( function() {
							camera.position.x = pos.x;
							camera.position.y = pos.y;
							camera.position.z = pos.z;
						})
						.start();

					selectedNode = null;
				}
			}

		}
	};

	this.onRightClick = function() {
		
		//go back to overview position
		if(selectedNode != null) {

			var currentPosition = new THREE.Vector3().copy(camera.position);
			var targetPosition = new THREE.Vector3().copy(history[history.length-1]);

			controls.target.set( targetPosition.x, targetPosition.y, selectedNode.position.z );

			var tween = new TWEEN.Tween( currentPosition )
				.to( targetPosition, 200 )
				.onUpdate( function() {
					camera.position.x = currentPosition.x;
					camera.position.y = currentPosition.y;
					camera.position.z = currentPosition.z;
				})
				.start();


			if( history.length > 1) {
				selectedNode.deSelect();
				selectedNode = null;	
			}
		}

		//rollback Expand
		else if(selectedNode === null) {
			if(historyExpand.length > 0) {

				var parentObj = historyExpand.pop();
				history.pop();

				var currentPosition = new THREE.Vector3().copy(camera.position);
				var targetPosition = new THREE.Vector3().copy(history[history.length-1]);

				var tween = new TWEEN.Tween( currentPosition )
					.to( targetPosition, 300 )
					.onUpdate( function() {
						camera.position.x = currentPosition.x;
						camera.position.y = currentPosition.y;
						camera.position.z = currentPosition.z;
					})
					.onComplete(function() {

						if(history.length == 1) {
							selectedNode = parentObj;	
							selectedNode.select();
						}

						parentObj.traverse( function( child ) {

							child.position.z += 18000;
						});

						controls.target.set( targetPosition.x, targetPosition.y, parentObj.position.z );
					})
					.start();

				parentObj.expanded = false;
			}
		}

	};
	/*
	this.onHover = function( intersects ) {
		
		if(intersects.length > 0) {
			
			var obj = intersects[0].object;


		}
	};
	*/
};