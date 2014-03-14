'use strict'

ES_EX.File = function( f ) {

	this.id = ES_EX.File.fid++;
	this.name;
	this.isValid = false;
	this.errors = false;
	this.errorsList = [];
	this.ast;
	this.scope;

	this.addAst = function( ast ) {

		this.ast = ast;
	};

	this.addScope = function( scope ) {
		this.scope = new ES_EX.Scope( scope, this.id );
		this.scope.addChildScopes();
	};

	this.toJSON = function() {

		return {

			name: this.name + " Global Scope",
			type: "FGS",
			vars: 0,
			fid: this.id,
			sid: this.scope.id,
			children: this.scope.children
		};
	};

	this.getLineNr = function() {

		return this.ast.body[ this.ast.body.length-1 ].loc.end.line;
	};

	this.getTotalVarCount = function() {
		
		var count = 0;
		count += this.scope.data.variables.length;

		this.scope.traverse( function(child) {
			count += child.data.variables.length;
		});

		return count;
	};

	this.getScopeCount = function() {
		
		var count = 1;

		this.scope.traverse( function(child) {
			count += 1;
		});

		return count;
	};

	this.getScopeforView = function() {

		var name = this.name;
		var scope = this.scope;
		
		scope.getName = function() {
			
			return name + "Global Scope";
		};

		return scope;
	}
};

