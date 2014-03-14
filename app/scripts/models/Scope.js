'use strict'

ES_EX.Scope = function( scope, fid ) { 

	this.id = ES_EX.Scope.sid++;
	this.data = scope;
	this.children = [];
	this.fid = fid;

	this.varCount = function() {

		var c = this.data.variables.length;
		return c;
	};

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
			name: this.getName(),
			type: "CS",
			vars: 0,
			fid: this.fid,
			sid: this.id,
			children: this.children
		};
	};

	this.getName = function() {

		switch(this.data.block.type){

			case 'FunctionExpression': {

				var lineNR = "[" + this.data.block.loc.start.line + ":" + this.data.block.loc.start.column + "]";
				var name = lineNR + " " + this.data.type + " (";

				for( var i = 0; i < this.data.block.params.length; i++ ) {
					name += " " + this.data.block.params[i].name;
					if(i != this.data.block.params.length-1){
						name += ",";
					}
				}

				name += " )";
				return name;
				break;
			}
			case 'FunctionDeclaration': {

				var name = this.data.type + " " + this.data.block.id.name +  " (";

				for( var i = 0; i < this.data.block.params.length; i++ ) {
					name += " " + this.data.block.params[i].name;
					if(i != this.data.block.params.length-1){
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

	this.getLineNr = function() {

	};

	this.getColNr = function() {

	};
};