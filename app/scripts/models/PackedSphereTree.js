'use strict'

ES_EX.PackedSphereTree = function( data ) {
	
	this.tree = JSON.parse(data);
	this.treeNodes;
	this.dim = (this.tree.dim * 80 < 10000) ? this.tree.dim * 80 : 10000;
	this.padding = 50;
	this.sceneObjects = [];
	this.objectFactory = new ES_EX.ObjectFactory();

	this.layout = d3.layout.pack()
		.size( [ this.dim, this.dim ] )
		.padding( this.padding )
		.sort(d3.descending)
		.value( function( d ) {
			return 150;
		});

	this.create = function () {

		var self = this;

		reCalc(this.tree);
		this.treeNodes = this.layout( this.tree );
		removePlaceholders( this.treeNodes );

		function reCalc(root) {

		  function recurse(name, node) {

		    if (node.children) 
		    	node.children.forEach( function( child ) {
	
		    		recurse(node.name, child);

		    		if(child.children) {

		    			if (child.children.length == 1) {
		    				child.children.push( { name:"placeholder", children:[{ name:"placeholder", children:[] }] });
		    			}
		    		} 
		    	});
		    }

		  recurse(null, root);

		  if( self.tree.children.length == 1 ) {

		  	self.tree.children.push( { name:"placeholder", children:[ { name:"placeholder", children:[] }] });
		  }
		};

		function removePlaceholders( t ) {

			for (var i = t.length-1; i >= 0; i--) {
			    
			    if ( t[i].name === "placeholder" ) {
			        t.splice(i, 1);
			    } else {
			    	if(t[i].children) {
			    		removePlaceholders( t[i].children );
			    	}	
			    }
			}
		};
	};

	this.getDrawObjects = function() {

		var drawObjects = [];

		//use this to have vis centered at 0,0,0 (easier for positioning)
		var offsetX = this.treeNodes[0].x;
		var offsetY = this.treeNodes[0].y;
		
		for( var i = 0; i < this.treeNodes.length; i ++ ) {

			var node = this.treeNodes[i];

			console.log(node.name);

			var obj;
			var r = node.r;
			var x = node.x - offsetX;
			var y = node.y - offsetY;

			switch( node.type ) {
				case "GS": {

					obj = this.objectFactory.createGlobalScopeSphere(r);
					obj.position.set(x,y,-node.depth);

					obj.userData.type = node.type;

					break;
				};
				case "FGS":{

					obj = this.objectFactory.createFileGlobalScopeSphere(r);
					obj.position.set(x,y,-node.depth);

					obj.userData.type = node.type;
					obj.userData.fid = node.fid;
					obj.userData.sid = node.sid;

					break;
				};
				case "CS": {

					obj = this.objectFactory.createScopeSphere(r);
					obj.position.set(x,y,-node.depth);

					obj.userData.type = node.type;
					obj.userData.fid = node.fid;
					obj.userData.sid = node.sid;

					break;
				};
			}

			obj.userData.children = [];
			obj.userData.expanded = false;
			obj.userData.selected = false;
			node.drawObject = obj;
			drawObjects.push(obj);
		}

		//attach links to children to each draw object!
		var node = this.treeNodes[0];
		var obj = node.drawObject;
		addChildren( obj, node.children );

		//adds children ref to draw object, used for positioning!
		function addChildren( parent, children ) {

			if(children) {
				for(var i = 0; i < children.length; i ++) {

					parent.userData.children.push( children[i].drawObject );
					addChildren( children[i].drawObject, children[i].children );
				}	
			}
		}

		return drawObjects;
	};
};