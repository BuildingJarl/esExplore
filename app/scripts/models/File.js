'use strict'

ES_EX.File = function( f ) {

	this.id = ES_EX.File.fid++;
	this.name;
	this.isValid = false;
	this.errors = false;
	this.errorsList = [];
	this.ast;
	this.scope;

	this.showSource = false;
	this.selected = false;

	this.addAst = function( ast ) {

		this.ast = ast;

		if(this.isValid) {
			this.source = escodegen.generate(this.ast);
		}
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

		var nr = this.ast.body[ this.ast.body.length-1 ].loc.end.line;
		
		if(!nr) {
			return '*';
		}

		return nr;
	};

	this.getScopeCount = function() {
		
		var count = 1;

		this.scope.traverse( function(child) {
			count += 1;
		});

		return count;
	};

	this.getScopeforView = function() {

		var scope = this.scope;
		scope.name = 'File Global Scope';
		return scope;
	};
};

