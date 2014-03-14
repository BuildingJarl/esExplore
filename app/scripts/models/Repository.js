'use strict';

ES_EX.Repository = function() {

	this.files = [];
	this.filesSet = {};

	this.scopes = [];
	this.scopeSet = {};

	this.globalScopes = [];
	this.globalScopesSet = {};


	this.addFile = function ( file ) {

		this.files.push( file );
		this.filesSet[ file.id ] = file;

		if(file.scope) {
			this.scopes.push( file.scope );
			this.scopeSet[ file.scope.id ] = file.scope;
			this.globalScopes.push( file.scope );
			this.globalScopesSet[ file.scope.id ] = file.scope;

			var self = this;
			file.scope.traverse( function( child ) {

				self.scopes.push( child );
				self.scopeSet[ child.id ] = child.scope;
			});	
		}    
	};

	this.toJSON = function() {

		var validFiles = [];

		for(var i = 0; i < this.files.length; i ++) {
			
			if(this.files[i].isValid) {
				validFiles.push(this.files[i]);
			}
		}

		return {

			name: "Global Scope",
			type: "GS",
			vars: 0,
			children: validFiles
		};
	};

	this.getValidFiles = function() {

		var files = [];

		for(var i = 0; i < this.files.length; i ++) {

			if(this.files[i].isValid === true) {
				var file = {};
				file.id = this.files[i].id;
				file.name = this.files[i].name;
				file.ScopeCount = this.files[i].getScopeCount();
				file.lineNr = this.files[i].getLineNr();
				file.varCount = this.files[i].getVarCount();

				files.push(file);
			}
		}

		return files;
	};

	this.getGlobalScope = function() {

		var scope = {};
   		scope.name = 'Global Scope'
   		scope.childrenCount = this.globalScopes.length;
   		scope.children = [];
   		scope.vars;

   		for( var i = 0; i < this.globalScopes.length; i++ ) {

   			for( var j = 0; j < this.globalScopes[i].children.length; j ++) {

   				scope.children.push( this.globalScopes[i].children[j] );
   			}
   		}

   		return scope;
	};

};