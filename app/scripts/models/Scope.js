'use strict'

ES_EX.Scope = function( scope, fid ) { 

	var self = this;
	this.id = ES_EX.Scope.sid++;
	this.data = scope;
	this.children = [];
	this.fid = fid;

	this.name = getName();
	this.startLoc = getStartLoc();
	this.endLoc = getEndLoc();




	this.traverse = function( func ) {
	
		for( var i = 0; i < this.children.length; i ++ ) {
			
			func( this.children[i] );
			this.children[i].traverse( func );
		}
	};

	this.addChildScopes = function( ) {

		for( var i = 0; i < this.data.childScopes.length; i++ ) {

			var child = new ES_EX.Scope( this.data.childScopes[i], this.fid );
			
			this.children.push( child );
			
			child.addChildScopes();
		}
	};

	this.toJSON = function() {

		return {
			name: this.name,
			type: "CS",
			vars: 0,
			fid: this.fid,
			sid: this.id,
			children: this.children
		};
	};

	function getName() {


		console.log(self.data.type);
		var name = '';

		switch(self.data.block.type){

			case 'FunctionExpression': {

				name += self.data.type + " (";

				for( var i = 0; i < self.data.block.params.length; i++ ) {
					name += " " + self.data.block.params[i].name;
					if(i != self.data.block.params.length-1){
						name += ",";
					}
				}

				name += " )";
				return name;
				break;
			}
			case 'FunctionDeclaration': {

				name += self.data.type + " " + self.data.block.id.name +  " (";

				for( var i = 0; i < self.data.block.params.length; i++ ) {
					name += " " + self.data.block.params[i].name;
					if(i != self.data.block.params.length-1){
						name += ",";
					}
				}

				name += " )";
				return name;
				break;
			}
		}

		return name;
	};

	function getStartLoc() {

		return self.data.block.loc.start.line; 
	};

	function getEndLoc() {

		return self.data.block.loc.end.line; 
	};
};