'use strict'

ES_EX.File = function( f ) {

	this.id = ES_EX.File.fid++;
	this.name;
	this.isValid = false;
	this.errors = false;
	this.errorsList = [];
	this.ast;
	this.scope;

	this.selected = false;

	this.addAst = function( ast ) {

		this.ast = ast;
	};

	this.addSource = function( data ) {

		if(this.isValid) {
			//this.source = escodegen.generate( this.ast, ES_EX.File.escodegenOptions );
			this.source = data.replace(/(\r\n|\r)/gm,"\n");
		}
	};

	this.addScope = function( scope ) {
		
		this.scope = new ES_EX.Scope( scope, this.id );
		this.scope.addChildScopes();
	};

	this.toJSON = function() {

		return {

			labelText: this.name + " Global Scope",
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

	this.getSourceFromTo = function( from, to) {

		var split = this.source.split('\n');
		var res = '';

		for( var i = from; i < to; i++) {
			res += split[i] + '\n';
		}

		return res;
	};
};

ES_EX.File.escodegenOptions = { 
	format: {
        newline: '\n\n',
        semicolons: false
    }
};