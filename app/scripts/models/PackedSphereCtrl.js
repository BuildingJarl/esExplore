'use strict'

ES_EX.PackedSphereCtrl = function( tree, callback ) {

	this.tree = tree;

	var controls;
	var camera;

	var selectedNode = null;
	var selectedTheta = 0.0;
	var scaleTime =  300;

	var history = [];
	var historyExpand = [];

	var hoveredNode = null;

	var busy = false;

	this.init = function( ccamera, ccontrols ) {

		camera = ccamera,
		controls = ccontrols;
		var root = this.tree.getRoot();

		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = root.r * 5;

		controls.minDistance = root.minDistToCamera(camera.fov);

		history.push(root.r * 5);
	};

	this.update = function( delta ) {

		this.tree.traverse( function( node ) {

			node.updateGlowViewVector( camera.position )
		});

		TWEEN.update();	
	};

	this.onLeftClick = function( intersects ) {
		
		if(busy) return

		var intersectedObj = intersects.i[0].object;

		//select obj
		if( selectedNode === null || intersectedObj.id !== selectedNode.doid  ) {

			busy = true;

			if( selectedNode ) {
				selectedNode.deSelect();
				selectedNode = null;
			}
			
			selectedNode = tree.getNodeById( intersectedObj.id );
			selectedNode.select();
			selectedNode.repositionSiblingsTo(5,scaleTime);

			callback({ type:selectedNode.type, fid:selectedNode.fid, sid:selectedNode.sid });

			//tween to new orbit center (if no tween then jump)
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
			
			//tween to new distance
			var oldDist = camera.position.distanceTo( selectedNode.position );
			var newDist =  selectedNode.minDistToCamera(camera.fov);

			controls.minDistance = oldDist;
			controls.maxDistance = oldDist;

			var tweenTwo = new TWEEN.Tween( { d:oldDist } )
				.to( { d:newDist}, scaleTime  )
				.onUpdate( function () {

					controls.minDistance = this.d;
					controls.maxDistance = this.d;
					controls.update();
				})
				.onComplete( function() {

					controls.maxDistance = Infinity;
					busy = false;
				} )
				.start();
		} 

		//if same obj has been selected again then its time to go into to sphere 
		else if( intersectedObj.id === selectedNode.doid ) {

			if( !selectedNode.expanded && selectedNode.canBeExpanded ) {

				busy = true;

				var oldDist = camera.position.distanceTo(selectedNode.position);
				var newDist = selectedNode.minDistToCamera(camera.fov);

				controls.minDistance = oldDist;
				controls.maxDistance = oldDist;

				var tween = new TWEEN.Tween( { d:oldDist } )
					.to( { d:newDist}, scaleTime  )
					.onUpdate( function () {

						controls.minDistance = this.d;
						controls.maxDistance = this.d;
					})
					.onComplete( function() {

						controls.minDistance = selectedNode.minChildrenDistToCamera(camera.fov);
						controls.maxDistance = Infinity;//set to histry?
						selectedNode = null;
						busy = false;
					} )
					.start();

				selectedNode.deSelect();
				selectedNode.expanded = true;
				selectedNode.rescaleTo(10, scaleTime);
				selectedNode.repositionSiblingsTo(10,scaleTime);

				//new overview position
				history.push( newDist );
				historyExpand.push( selectedNode );	
			}
		}
	};

	this.onRightClick = function() {

		if(busy) return
		
		//go back to overview position
		if(selectedNode != null) {

			busy = true;

			if(historyExpand[historyExpand.length-1]) {
				callback( { 
					type:historyExpand[historyExpand.length-1].type, 
					fid:historyExpand[historyExpand.length-1].fid, 
					sid:historyExpand[historyExpand.length-1].sid 
				});

				//tween to new orbit center (if no tween then jump)
				var from = new THREE.Vector3().copy( controls.target );
				var to = new THREE.Vector3().copy( historyExpand[historyExpand.length-1].position );

				var tweenOne = new TWEEN.Tween( from )
					.to( to, scaleTime )
					.onUpdate( function() {
						controls.target.x = from.x;
						controls.target.y = from.y;
						controls.target.z = from.z;
					})
					.start();
			}

			var oldDist = camera.position.distanceTo(selectedNode.position);
			var newDist = history[history.length-1];

			var tweenTwo = new TWEEN.Tween( { d:oldDist } )
				.to( { d:newDist}, scaleTime  )
				.onUpdate( function () {

					controls.minDistance = this.d;
					controls.maxDistance = this.d;
				})
				.onComplete( function() {

					controls.minDistance = selectedNode.minDistToCamera(camera.fov);
					controls.maxDistance = Infinity;
					selectedNode.deSelect();
					selectedNode = null;
					busy = false;
				} )
				.start();

			selectedNode.repositionSiblingsBack(5,scaleTime);
		}

		//rollback Expand
		else if(selectedNode === null) {
			
			busy = true;

			if(historyExpand.length > 0) {

				callback( { 
					type:historyExpand[historyExpand.length-1].type, 
					fid:historyExpand[historyExpand.length-1].fid, 
					sid:historyExpand[historyExpand.length-1].sid 
				});

				var parentObj = historyExpand.pop();

				parentObj.rescaleBack(10,scaleTime);
				parentObj.repositionSiblingsBack(15,scaleTime);

				var oldDist = history.pop();
				var newDist = history[history.length-1];

				controls.minDistance = oldDist;
				controls.maxDistance = oldDist;

				var tweenTwo = new TWEEN.Tween( { d:oldDist } )
					.to( { d:newDist}, scaleTime  )
					.onUpdate( function () {

						controls.minDistance = this.d;
						controls.maxDistance = this.d;
					})
					.onComplete( function() {

						//controls.minDistance = selectedNode.r * 2.4;
						controls.maxDistance = Infinity;
						busy = false;
					} )
					.start();

				parentObj.expanded = false;
			} else {
				busy = false;
			}
		}
	};
	
	this.onHover = function( intersects ) {

		var obj = tree.getNodeById(intersects.i[0].object.id);

		if( obj !== hoveredNode ) {

			hoveredNode = obj;

			obj.label.position.z = -700;
			camera.add(obj.label)
			console.log('added');
		}

		console.log( intersects.x + " " + intersects.y);
		obj.label.position.x = intersects.x;
		obj.label.position.y = intersects.y;

	};

	this.onHoverOff = function( x , y ) {

		

		if(hoveredNode) {
			camera.remove(hoveredNode.label)
			console.log( 'removied' );
			hoveredNode = null;
		}
	};
	
};