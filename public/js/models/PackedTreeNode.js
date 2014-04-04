/*
    Ivan Bacher
    C10736831
    ivan.bacher@mydit.ie

    Model

    This model uses the third party TWEEN  library
    all calls to the library are prefixed with TWEEN.****
*/


'use strict';

ES_EX.PackedTreeNode = function( node ) {

	node.label = undefined;
	node.drawObject = undefined;;
	node.position;
	node.canBeExpanded = cbex();
	node.expanded = false;
	node.selected = false;

	node.minDistToCamera = function( fov ) {
		//http://stackoverflow.com/questions/22500214/calculate-camera-fov-distance-for-sphere
		var dist =  this.r / (Math.sin( fov * (Math.PI/180) / 2 ));
		return dist
	};

	node.minChildrenDistToCamera = function( fov ) {
		
		var topY = - 999999999999;
		var bottomY =  9999999999;

		for(var i = 0; i < this.children.length; i ++) {

			var child = this.children[i];

			var ty = child.position.y + child.r;
			var by = child.position.y - child.r;

			if( ty > topY ) {
			 	topY = ty;
			}

			if( by < bottomY ) {
				bottomY = by;
			}
		}

		var height = Math.abs(topY - bottomY);
		var vFov = fov * (Math.PI / 180)
		var dist =  height / (2 * Math.tan( vFov / 2 ));
		return dist;
	};

	node.select = function() {
		
		this.selected = true;
	};

	node.deSelect = function() {
		
		this.selected = false;
	};

	node.updateGlowViewVector = function( camPos ) {

		var newViewVec = new THREE.Vector3().subVectors( camPos, this.position );
		this.drawObject.material.uniforms.viewVector.value = newViewVec	;	
	};

	node.traverse = function( action ) {

		if(this.children) {
			for(var i = 0; i < this.children.length; i++) {

				action( this.children[i] );
				this.children[i].traverse( action );
			}
		}
	};

	function cbex() {

		if(node.children) {

			if(node.children.length != 0) {
				return true;
			}
		}

		return false;
	};

	node.tween = function( to, time ) {

		var self = this;

		var tween = new TWEEN.Tween( {x:this.position.x, y:this.position.y} )
			.to( to, time )
			.onUpdate( function() {

				self.position.x = this.x;
				self.position.y = this.y;
			})
			.start();
	};

	node.repositionSiblingsTo = function( scaler, time ) {

		if( this.parent ) {

			var origin = new THREE.Vector3().copy( this.position );
			scaler *= this.r;

			for( var i = 0; i < this.parent.children.length; i++ ) {

				var child = this.parent.children[i];
				
				if(child !== this) {

					var look = new THREE.Vector3().copy(child.position);
					look.sub(origin);
					look.normalize();

					var newPos = {};
					newPos.x = child.position.x + (look.x * scaler);
					newPos.y = child.position.y + (look.y * scaler); 

					child.tween( newPos, time );

					child.traverse( function(ch) {

						var look = new THREE.Vector3().copy(child.position);
						look.sub(origin);
						look.normalize();

						var newPos = {};
						newPos.x = ch.position.x + (look.x * scaler);
						newPos.y = ch.position.y + (look.y * scaler);

						ch.tween( newPos, time );
					});
				}
			}
		}
	};

	node.repositionSiblingsBack = function( scaler,time ) {

		if( this.parent ) {

			var origin = new THREE.Vector3().copy(this.position);
			scaler *= this.r;

			for( var i = 0; i < this.parent.children.length; i++ ) {

				var child = this.parent.children[i];
				
				if( child !== this ) {

					var look = new THREE.Vector3().copy(child.position);
					look.sub(origin);
					look.normalize();

					var newPos = {};
					newPos.x = child.position.x + (-look.x * scaler);
					newPos.y = child.position.y + (-look.y * scaler);

					child.tween( newPos, time );

					child.traverse( function(ch) {

						var look = new THREE.Vector3().copy(child.position);
						look.sub(origin);
						look.normalize();

						var newPos = {};
						newPos.x = ch.position.x + (-look.x * scaler);
						newPos.y = ch.position.y + (-look.y * scaler);

						ch.tween( newPos, time )
					});
				}
			}
		}
	};

	node.rescaleTo = function( scaler, time ) {

		var self = this;
		var from = this.r;
		var to = this.r * scaler;

		var tween = new TWEEN.Tween( { s:from } )
			.to( { s:to }, time)
			.onUpdate( function() {
				
				self.drawObject.scale.x = this.s;
				self.drawObject.scale.y = this.s;
				self.drawObject.scale.z = this.s;
			})
			.start();
	};

	node.rescaleBack = function( scaler, time ) {

		var self = this;
		var from = this.drawObject.scale.x;
		var to = this.r;

		var tween = new TWEEN.Tween( { s:from } )
			.to( { s:to }, time)
			.onUpdate( function() {
				
				self.drawObject.scale.x = this.s;
				self.drawObject.scale.y = this.s;
				self.drawObject.scale.z = this.s;
			})
			.start();
	};
};


/*
    Ivan Bacher
    C10736831
    ivan.bacher@mydit.ie

    Model

    This model uses the third party D3.js  library
    all calls to the library are prefixed with D3.****

*/

ES_EX.PackedSphereTreeUtils = function() {

	this.calculateLayout = function( dim, tree ) {

		//this is from d3.js
		var packlayout = d3.layout.pack()
			.size( [dim, dim] )
			.padding( 50 )
			.sort( d3.decending )
			.value( function( d ) { return 50 } );

		addPlaceholders(tree);

		var nodes = packlayout( tree ); //d3.js

		removePlaceholders(nodes);

		centerNodes( nodes );

		makePositionsRelativeToZero( nodes );

		addToRadius(nodes)

		expandNodes( nodes );

		return nodes;
	};

	function expandNodes( nodes) {
		
		for(var i = 0; i < nodes.length; i++) {

			ES_EX.PackedTreeNode(nodes[i] );
		}
	};

	function addPlaceholders( node ) {

		if(node.children) {

			for( var i = 0; i < node.children.length; i++ ) {

				var child = node.children[i];
				addPlaceholders( child );
			}

			if(node.children.length === 1) {

				node.children.push({ 
					name:'placeholder', 
					children: [ { 
						name:'placeholder', children:[] }] });
			}
		}
	};

	function removePlaceholders( nodes ) {

		for( var i = nodes.length - 1; i >= 0; i-- ) {

			var node = nodes[i];
			
			if( node.name === 'placeholder' ) {

				nodes.splice(i,1);
			} else {

				if( node.children ) {

					removePlaceholders( node.children );
				}
			}
		}
	};

	function addToRadius(nodes) {

		for( var i = 0; i < nodes.length; i ++ ) { 

			if(nodes[i].children) {
				if( nodes[i].children.length > 1) {
					nodes[i].r += 30;
				}	
			}	
		}
	};

	function centerNodes( nodes ) {

		for( var i = 0; i < nodes.length; i ++ ) {

			var node = nodes[i];

			if( node.children ) {

				if( node.children.length === 1) {

					var offset = node.x - node.children[0].x;
					node.children[0].x += offset;
					reposition(node.children[0],offset);
				}
			}
		}

		function reposition( node, offset ) {

			if(node.children) {
				for( var i = 0; i < node.children.length; i++ ) {

					node.children[i].x += offset;
					reposition( node.children[i], offset );
				}
			}
		};
	};

	function makePositionsRelativeToZero( nodes ) {
		
		//use this to have vis centered at 0,0,0 (easier for positioning)
		var offsetX = nodes[0].x;
		var offsetY = nodes[0].y;

		for( var i = 0; i < nodes.length; i ++ ) {

			var node = nodes[i];

			node.x -= offsetX;
			node.y -= offsetY;
		}
	};

	this.addSpheresToNodes = function( nodes ) {

		var objectFactory = new ES_EX.ObjectFactory();

		for( var i = 0; i < nodes.length; i++ ) {

			var node = nodes[i];

			node.position = new THREE.Vector3( node.x,node.y, 0 );

			switch( node.type ) {

				case 'GS': {

					node.drawObject = objectFactory.createGlobalScopeSphere( node.r, node.position);

					break;
				}

				case 'FGS': {

					node.drawObject = objectFactory.createFileGlobalScopeSphere( node.r, node.position);
				
					break;
				}

				case 'CS': {

					node.drawObject = objectFactory.createScopeSphere( node.r, node.depth, node.position);
						
					break;
				}
			}

			node.doid = node.drawObject.id;
			node.color = node.drawObject.userData.color;
		}
	};
};