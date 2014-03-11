'use strict'

ES_EX.PackedSphereTree = function() {
	
	var treeNodes;

	var objectFactory = new ES_EX.ObjectFactory();
	var utils = new ES_EX.PackedSphereTreeUtils();


	this.create = function ( jsonTree ) {

		treeNodes = utils.calculateLayout( 12000, JSON.parse( jsonTree ) );
	};

	this.getDrawObjects = function() {

		var drawObjects = [];

		for( var i = 0; i < treeNodes.length; i ++ ) {

			var node = treeNodes[i];

			console.log(node.name);

			var obj;
			var r = node.r;
			var x = node.x;
			var y = node.y;

			switch( node.type ) {
				case "GS": {

					obj = objectFactory.createGlobalScopeSphere(r);
					obj.position.set(x,y,-node.depth);

					obj.userData.type = node.type;

					break;
				};
				case "FGS":{

					obj = objectFactory.createFileGlobalScopeSphere(r);
					obj.position.set(x,y,-node.depth);

					obj.userData.type = node.type;
					obj.userData.fid = node.fid;
					obj.userData.sid = node.sid;

					break;
				};
				case "CS": {

					obj = objectFactory.createScopeSphere(r);
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
		var node = treeNodes[0];
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