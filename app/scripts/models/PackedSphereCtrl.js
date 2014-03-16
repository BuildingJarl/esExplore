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

				controls.target.copy( selectedNode.position );
				//constrict zoom --todo

				var camPos = new THREE.Vector3().copy( camera.position );
				var newCamPos = new THREE.Vector3().copy(selectedNode.position);
				newCamPos.z += selectedNode.r * 2.6;

				var tween = new TWEEN.Tween( camPos )
					.to( newCamPos, 200 )
					.onUpdate( function() {
						camera.position.x = camPos.x;
						camera.position.y = camPos.y;
						camera.position.z = camPos.z;
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


					selectedNode.repositionSiblingsTo(100);
					//get siblings and calc new pos

					//set new Controlls target pos
					controls.target.copy(selectedNode.position);

					//setTweenForCamera
					var pos = new THREE.Vector3().copy( camera.position );
					var newPos = new THREE.Vector3().copy(selectedNode.position);
					newPos.z += selectedNode.r * 2.55;

					history.push( newPos );
					historyExpand.push( selectedNode );

					var tweenScale = new TWEEN.Tween( { s:selectedNode.r } )
						.to( { s:selectedNode.r + 10000 }, 200)
						.onUpdate( function() {

							selectedNode.drawObject.scale.x = this.s;
							selectedNode.drawObject.scale.y = this.s;
							selectedNode.drawObject.scale.z = this.s;
						})
						.onComplete( function() {
							selectedNode = null;
						});

					var tweenCam = new TWEEN.Tween( pos )
						.to( newPos, 200 )
						.onUpdate( function() {
							camera.position.x = pos.x;
							camera.position.y = pos.y;
							camera.position.z = pos.z;
						});

					tweenScale.start();
					tweenCam.start();
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

			controls.target.set( targetPosition.x, targetPosition.y, selectedNode.position.z );

			var tween = new TWEEN.Tween( currentPosition )
				.to( targetPosition, 200 )
				.onUpdate( function() {
					camera.position.x = currentPosition.x;
					camera.position.y = currentPosition.y;
					camera.position.z = currentPosition.z;
				})
				.start();


			if( history.length > 0) {
				selectedNode.deSelect();
				selectedNode = null;	
			}
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
				parentObj.repositionSiblingsBack(100);

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

				var testtest = new TWEEN.Tween( {s:parentObj.r + 10000} )
					.to( {s:parentObj.r}, 200)
					.onUpdate( function() {

						parentObj.drawObject.scale.x = this.s;
						parentObj.drawObject.scale.y = this.s;
						parentObj.drawObject.scale.z = this.s;
					})
					.start();
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