'use strict'

ES_EX.EsprimaExtractor = function() {

	this.extractParameters = function( block ) {

		var params = '( ';

		for( var i = 0; i < block.params.length; i++ ) {
			
			params += block.params[i].name;
			
			if(i != block.params.length - 1) {
				params += ", ";
			}
		}

		params += " )";	

		return params;
	};

	this.getFunctionExpressionName = function( scope ) {
		
		var parent = scope.upper.block;
		var location = scope.block.loc;
		var name;

		var parser = {

			assignmentExpression: function(node) {

				var left = node.left;
				var name;

				if(left.type == 'MemberExpression') {

					if(left.object.type == 'ThisExpression' ) {

						name = 'this' + "." + left.property.name;
					}

					if( left.object.type == 'Identifier' ) {

						name = left.object.name + "." + left.property.name;
					}
				}
				
				return name;
			},

			property: function(node) {
				
				//might have to loop through a second time to get objt ob property?
				var name = node.key.name;
				return name;
			},

			functionExpression: function(node) {
				
				//console.log(node);

				return 'anonymous function'
			}
		};

		var cases = {
		    AssignmentExpression: parser.assignmentExpression,
		    FunctionExpression: parser.functionExpression,
		    Property: parser.property
		};


		estraverse.traverse( parent, {

		    enter: function (node, parent) {
       			
       			if( endOnSameLine( location, node.loc )) {
       				
   					if (cases[node.type]) {
    					name = cases[node.type](node);
					}

       				this.break();
       			}
		    }
		});

		return name;
	};

	function endOnSameLine( loc1, loc2 ) {

		if( loc1.end.line === loc2.end.line) {
			if(loc1.end.column === loc2.end.column) {
				return true;
			}
		}
		return false
	};
};