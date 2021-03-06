'use strict';

ES_EX.PackedTreeNode = function( node ) {

	node.label = undefined;
	node.drawObject = undefined;;
	node.position;
	node.canBeExpanded = cbex();
	node.expanded = false;
	node.selected = false;

	node.minDistToCamera = function( fov ) {
		/*
			var height = (this.r * 2);
			var vFov = fov * (Math.PI / 180)
			var dist =  height / (2 * Math.tan( vFov / 2 ));
			//var dist =  radius / ( Math.sin( camera.fov * ( Math.PI / 180 ) / 2 ) );
			return dist;
		*/
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
		this.drawObject.getObjectByName('selected').visible = true;
	};

	node.deSelect = function() {
		
		this.selected = false;
		this.drawObject.getObjectByName('selected').visible = false;
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