'use strict';

//rename to packedSphereModel!
ES_EX.PackedSphereTreeUtils = function() {

	this.calculateLayout = function( dim, tree ) {

		var packlayout = d3.layout.pack()
			.size( [dim, dim] )
			.padding( 80 )
			.sort( d3.descending )
			.value( function( d ) { return 150 } );

		addPlaceholders(tree);

		var nodes = packlayout( tree );

		removePlaceholders(nodes);

		centerNodes( nodes );

		makePositionsRelativeToZero( nodes );

		return nodes;
	};

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

			var sphere = new ES_EX.SphereScope();
			
			sphere.type = node.type;
			sphere.position = new THREE.Vector3( node.x,node.y,0 );

			sphere.label = objectFactory.createLabel( node.name, sphere.position );


			switch( node.type ) {

				case 'GS': {

					sphere.drawObject = objectFactory.createGlobalScopeSphere( node.r, sphere.position);

					break;
				}

				case 'FGS': {

					sphere.drawObject = objectFactory.createFileGlobalScopeSphere( node.r, sphere.position);
					
					sphere.fid = node.fid;
					sphere.sid = node.sid;

					break;
				}

				case 'CS': {

					sphere.drawObject = objectFactory.createScopeSphere( node.r, node.depth, sphere.position);
					
					sphere.fid = node.fid;
					sphere.sid = node.sid;
					
					break;
				}
			}

			node.sphere = sphere;
		}
	};
};