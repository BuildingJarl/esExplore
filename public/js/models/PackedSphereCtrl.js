'use strict'

ES_EX.PackedSphereCtrl = function( tree, clickCallback, hoverCallback ) {

	this.tree = tree;
	var self = this;
	var controls;
	var camera;

	var selectedNode = null;
	var selectedTheta = 0.0;
	var scaleTime =  300;

	var history = [];
	var historyExpand = [];

	var hoveredNode = null;
	var disableOnMouseOut = false;

	var busy = false;

	var label = createLabel();

	function createLabel() {

		var element = document.createElement('span');
    	//element.textContent = text;
    	element.className = 'SphereLabel';
    	element.style.display = 'none';
    	var cont = document.getElementById('scopeViewer');

    	cont.onmouseout = function() {
    		
    		if(!disableOnMouseOut) {
    			self.onHoverOff();
    		}
    	};

    	cont.appendChild(element);

    	return element;
	};

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

		var intersectedObj = intersects[0].object;
		var selectedNode = tree.getNodeById( intersectedObj.id );

		if( !selectedNode.expanded && selectedNode.canBeExpanded ) {

			busy = true;

			clickCallback({ type:selectedNode.type, fid:selectedNode.fid, sid:selectedNode.sid, color:selectedNode.color });

			var oldDist = camera.position.distanceTo(selectedNode.position);
			var newDist = selectedNode.minDistToCamera(camera.fov);

			controls.minDistance = oldDist;
			controls.maxDistance = oldDist;

			//tween to new orbit center (if no tween then jump)
			var from = new THREE.Vector3().copy( controls.target );
			var to = new THREE.Vector3().copy( selectedNode.position );

			var orbitCenterTween = new TWEEN.Tween( from )
				.to( to, scaleTime )
				.onUpdate( function() {
					controls.target.x = from.x;
					controls.target.y = from.y;
					controls.target.z = from.z;
				})
				.start();

			var zoomTween = new TWEEN.Tween( { d:oldDist } )
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
		else if( !selectedNode.canBeExpanded ) {

			clickCallback({ type:selectedNode.type, fid:selectedNode.fid, sid:selectedNode.sid, color:selectedNode.color });

		}
	};

	this.onRightClick = function() {

		if(busy) return
		
		busy = true;

		if(historyExpand.length > 0) {

			var parentObj = historyExpand.pop();

			parentObj.rescaleBack(10,scaleTime);
			parentObj.repositionSiblingsBack(10,scaleTime);

			var oldDist = history.pop();
			var newDist = history[history.length-1];

			controls.minDistance = oldDist;
			controls.maxDistance = oldDist;

			if(parentObj.type == 'GS') {
				
				clickCallback( { type:parentObj.type, fid:parentObj.fid, sid:parentObj.sid, color:parentObj.color });
				
				var from = new THREE.Vector3().copy( controls.target );
				var to = new THREE.Vector3().copy( parentObj.position );

				var orbitCenterTween = new TWEEN.Tween( from )
				.to( to, scaleTime )
				.onUpdate( function() {
					controls.target.x = from.x;
					controls.target.y = from.y;
					controls.target.z = from.z;
				})
				.start();

				var zoomTween = new TWEEN.Tween( { d:oldDist } )
				.to( { d:newDist}, scaleTime  )
				.onUpdate( function () {

					controls.minDistance = this.d;
					controls.maxDistance = this.d;
				})
				.onComplete( function() {

					controls.minDistance = parentObj.minDistToCamera(camera.fov);
					controls.maxDistance = Infinity;
					busy = false;
				} )
				.start();
			} else {

				var obj = historyExpand[historyExpand.length-1];

				clickCallback( { type:obj.type, fid:obj.fid, sid:obj.sid, color:parentObj.color });

				var from = new THREE.Vector3().copy( controls.target );
				var to = new THREE.Vector3().copy(  obj.position );
				
				var orbitCenterTween = new TWEEN.Tween( from )
				.to( to, scaleTime )
				.onUpdate( function() {
					controls.target.x = from.x;
					controls.target.y = from.y;
					controls.target.z = from.z;
				})
				.start();

				var zoomTween = new TWEEN.Tween( { d:oldDist } )
					.to( { d:newDist}, scaleTime  )
					.onUpdate( function () {

						controls.minDistance = this.d;
						controls.maxDistance = this.d;
					})
					.onComplete( function() {

						controls.minDistance = obj.minChildrenDistToCamera(camera.fov);
						controls.maxDistance = Infinity;
						busy = false;
					} )
					.start();
			}

			parentObj.expanded = false;
		} else {

			busy = false;
		}
	};
	
	this.onHover = function( intersects, x, y ) {

		var obj = tree.getNodeById(intersects[0].object.id);

		var data = { type: obj.type, fid: obj.fid, sid: obj.sid, color: obj.color }

		hoverCallback( { hover: true, data: data }  );

		if( obj !== hoveredNode ) {

			hoveredNode = obj;
			label.textContent = hoveredNode.labelText;
			label.style.top = x + 'px';
			label.style.left = y + 'px';
			label.style.display = 'block';
		}

		label.style.top = y + 'px';
		label.style.left = x + 15 + 'px';
	};

	this.onHoverOff = function( x , y ) {

		hoverCallback( { hover: false, data: undefined }  );

		if(hoveredNode) {
			label.style.display = 'none';
			hoveredNode = null;
		}
	};

	this.hideLabel = function() {
		
		disableOnMouseOut = true;
		label.style.display = 'none';
		hoveredNode = null;
	};

	this.showLabel = function() {

    	disableOnMouseOut = false;		
	};
	
};