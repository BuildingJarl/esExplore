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
			
		var intersectedObj = intersects[0].object;

		if( selectedNode == null || intersectedObj.id != selectedNode.doid  ) {

			if( selectedNode ) {
				selectedNode.deSelect();
				selectedNode.hideLabel();
			}
			
			selectedNode = tree.getNodeById(intersectedObj.id);
			selectedNode.select();
			selectedNode.showLabel();

			callback({ type:selectedNode.type, fid:selectedNode.fid, sid:selectedNode.sid });

			var from = new THREE.Vector3().copy( controls.target );
			var to = new THREE.Vector3().copy( selectedNode.position );
			
			var tweenOne = new TWEEN.Tween( from )
				.to( to, scaleTime )
				.onUpdate( function() {
					controls.target.x = from.x;
					controls.target.y = from.y;
					controls.target.z = from.z;
				})
				.start();

			var fromCam = new THREE.Vector3().copy( camera.position );
			var toCam = new THREE.Vector3().copy( selectedNode.position );
			toCam.z += selectedNode.r * 2.7;

			var tweenTwo = new TWEEN.Tween( fromCam )
				.to( toCam, scaleTime )
				.onUpdate( function() {

					camera.position.x = fromCam.x;
					camera.position.y = fromCam.y;
					camera.position.z = fromCam.z;
				})
				.start();

		} else
		//if same obj has been selected again then its time to go into to sphere 
		if( intersectedObj.id === selectedNode.doid ) {

			if( !selectedNode.expanded && selectedNode.canBeExpanded ) {

				var from = new THREE.Vector3().copy( controls.target );
				var to = new THREE.Vector3().copy( selectedNode.position );
				
				var tweenOne = new TWEEN.Tween( from )
					.to( to, scaleTime )
					.onUpdate( function() {
						controls.target.x = from.x;
						controls.target.y = from.y;
						controls.target.z = from.z;
					})
					.start();

				var fromCam = new THREE.Vector3().copy( camera.position );
				var toCam = new THREE.Vector3().copy( selectedNode.position );
				toCam.z += selectedNode.r * 2.7;

				var tweenTwo = new TWEEN.Tween( fromCam )
					.to( toCam, scaleTime )
					.onUpdate( function() {

						camera.position.x = fromCam.x;
						camera.position.y = fromCam.y;
						camera.position.z = fromCam.z;
					})
					.start();

				selectedNode.deSelect();
				selectedNode.hideLabel();
				selectedNode.showChildrenLabels();
				selectedNode.expanded = true;

				selectedNode.repositionSiblingsTo(10,scaleTime);

				history.push( toCam );
				historyExpand.push( selectedNode );

				selectedNode.rescaleTo(10, scaleTime, function() {

					selectedNode = null;
				});
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
					.to( targetPosition, scaleTime )
					.onUpdate( function() {
						
						camera.position.x = currentPosition.x;
						camera.position.y = currentPosition.y;
						camera.position.z = currentPosition.z;
						controls.target.set( currentPosition.x, currentPosition.y, parentObj.position.z );
					})
					.onComplete(function() {

						if(history.length == 1) {
							
							selectedNode = parentObj;	
							selectedNode.select();
						}
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