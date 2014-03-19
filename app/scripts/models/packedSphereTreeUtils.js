'use strict';

//rename to packedSphereModel!
ES_EX.PackedSphereTreeUtils = function() {

	this.calculateLayout = function( dim, tree ) {

		var packlayout = d3.layout.pack()
			.size( [dim, dim] )
			.padding( 50 )
			.sort( d3.ascending )
			.value( function( d ) { return 50 } );

		addPlaceholders(tree);

		var nodes = packlayout( tree );

		removePlaceholders(nodes);

		centerNodes( nodes );

		makePositionsRelativeToZero( nodes );

		expandNodes( nodes );

		return nodes;
	};

	function expandNodes( nodes) {
		
		for(var i = 0; i < nodes.length; i++) {

			ES_EX.PackedTreeNode(nodes[i] );
		}
	}

	function addPlaceholders( node ) {

		if(node.children) {

			for( var i = 0; i < node.children.length; i++ ) {

				var child = node.children[i];
				addPlaceholders( child );
			}

			if(node.children.length === 1) {

				node.children.push({ name:'placeholder', children: [ { name:'placeholder', children:[] }] });
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

			node.label = objectFactory.createLabel( node.r, node.label, node.position );


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
		}
	};


};