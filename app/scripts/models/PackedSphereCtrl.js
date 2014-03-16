'use strict'

ES_EX.PackedSphereCtrl = function( tree, callback ) {

	this.tree = tree;

	var controls;
	var camera;

	var selectedNode = null;
	var selectedTheta = 0.0;
	var scaleTime =  500;

	var history = [];
	var historyExpand = [];

	this.init = function( ccamera, ccontrols ) {

		camera = ccamera,
		controls = ccontrols;

		var root = this.tree.getRoot();

		var initalCamPos = new THREE.Vector3( 0, 0, root.r * 4 );
		camera.position = new THREE.Vector3().copy(initalCamPos);

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

			if( selectedNode == null || intersectedObj.id != selectedNode.doid  ) {

				if( selectedNode ) {
					selectedNode.deSelect();
					selectedNode.hideLabel();
				}
				
				selectedNode = tree.getNodeById(intersectedObj.id);
				selectedNode.select();

				callback({ type:selectedNode.type, fid:selectedNode.fid, sid:selectedNode.sid });


				//constrict zoom --todo

				var camPos = new THREE.Vector3().copy( camera.position );
				var newCamPos = new THREE.Vector3().copy(selectedNode.position);
				newCamPos.z += selectedNode.r * 2.6;

				var tween = new TWEEN.Tween( camPos )
					.to( newCamPos, scaleTime )
					.onUpdate( function() {
						camera.position.x = camPos.x;
						camera.position.y = camPos.y;
						camera.position.z = camPos.z;

						controls.target.set( camPos.x, camPos.y, selectedNode.position.z );
					})
					.start();
			} else
			//if same obj has been selected again then its time to go into to sphere 
			if( intersectedObj.id === selectedNode.doid ) {

				if( !selectedNode.expanded && selectedNode.canBeExpanded ) {

					selectedNode.deSelect();
					selectedNode.hideLabel();
					selectedNode.showChildrenLabels();
					selectedNode.expanded = true;


					selectedNode.repositionSiblingsTo(10,scaleTime);
					//get siblings and calc new pos

					//set new Controlls target pos
					controls.target.copy(selectedNode.position);

					//setTweenForCamera
					var pos = new THREE.Vector3().copy( camera.position );
					var newPos = new THREE.Vector3().copy(selectedNode.position);
					newPos.z += selectedNode.r * 2.55;

					history.push( newPos );
					historyExpand.push( selectedNode );

					selectedNode.rescaleTo(10, scaleTime, function() {

						selectedNode = null;
					});

					var tweenCam = new TWEEN.Tween( pos )
						.to( newPos, scaleTime )
						.onUpdate( function() {
							camera.position.x = pos.x;
							camera.position.y = pos.y;
							camera.position.z = pos.z;
						})
						.start();
				}
			}

		}
	};

	this.onRightClick = function() {
		
		//go back to overview position
		if(selectedNode != null) {

			if(historyExpand[historyExpand.length-1]) {
				callback( { 
					type:historyExpand[historyExpand.length-1].type, 
					fid:historyExpand[historyExpand.length-1].fid, 
					sid:historyExpand[historyExpand.length-1].sid 
				});
			}


			var currentPosition = new THREE.Vector3().copy(camera.position);
			var targetPosition = new THREE.Vector3().copy(history[history.length-1]);


			var tween = new TWEEN.Tween( currentPosition )
				.to( targetPosition, scaleTime )
				.onUpdate( function() {
					camera.position.x = currentPosition.x;
					camera.position.y = currentPosition.y;
					camera.position.z = currentPosition.z;
					controls.target.set( currentPosition.x, currentPosition.y, selectedNode.position.z );

				})
				.onComplete( function() {
					if( history.length > 0) {
						selectedNode.deSelect();
						selectedNode = null;	
					}
				})
				.start();
		}

		//rollback Expand
		else if(selectedNode === null) {
			
			if(historyExpand.length > 0) {

				callback( { 
					type:historyExpand[historyExpand.length-1].type, 
					fid:historyExpand[historyExpand.length-1].fid, 
					sid:historyExpand[historyExpand.length-1].sid 
				});

				var parentObj = historyExpand.pop();
				history.pop();

				parentObj.rescaleBack(10,scaleTime);
				parentObj.repositionSiblingsBack(10,scaleTime);

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

							//child.position.z += 18000;
						});

						controls.target.set( targetPosition.x, targetPosition.y, parentObj.position.z );
					})
					.start();

				parentObj.expanded = false;
				parentObj.hideChildrenLabels();
				parentObj.showLabel();
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