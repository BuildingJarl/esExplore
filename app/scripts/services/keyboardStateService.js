angular.module('esExploreApp')
   .service( 'keyboardStateService', function( $q, $interval ) {

   		//keyup
		//keydown

	var keycodes = {
		17: 'ctrl',
      32: 'space'
	};

	var keys = {
		ctrl: { isDown:false, callback: undefined },
      space: { isDown:false, callback: undefined }
	};

	this.bindCallback = function( toWhat, cb ) {

		keys[toWhat].callback = cb;
	};

   	this.keydown = function( which ) {

   		if( keycodes[which] ) {

   			keys[ keycodes[ which ] ].isDown = true;

   			if( keys[ keycodes[ which ] ].callback !== undefined ) {
   				keys[ keycodes[ which ] ].callback(keys[ keycodes[ which ] ]);
   			}
   		}
   	};

   	this.keyup = function( which ) {

   		if( keycodes[which] ) {

   			keys[ keycodes[ which ] ].isDown = false;
   			
   			if( keys[ keycodes[ which ] ].callback !== undefined ) {
   				keys[ keycodes[ which ] ].callback(keys[ keycodes[ which ] ])
   			}
   		}
   	};
});