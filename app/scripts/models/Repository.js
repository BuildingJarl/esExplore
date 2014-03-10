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

};