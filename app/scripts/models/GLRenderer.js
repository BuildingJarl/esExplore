'use strict'

ES_EX.GLRenderer = function( ) {

	var self;

	this.visCtrl;
	this.clock;
	this.camera;
	this.scene;
	this.renderer;
	this.stats;
	this.controls;
	this.container;
	this.projector;
	this.frameId;

	this.init = function( container, debug ) {

		this.clock = new THREE.Clock();
		this.container = container;

		var width = this.container.clientWidth;
		var height = this.container.clientHeight;

		this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera( 45, width/height, 0.1, 150000);
	    this.renderer = new THREE.WebGLRenderer( {antialias: true } );
	    this.renderer.sortObjects = false;
	    this.renderer.setClearColor(0x272822, 1);
	    this.projector = new THREE.Projector();

      	this.renderer.domElement.style.display = "block";
      	this.renderer.setSize( width, height );

      	this.controls = new THREE.OrbitControls( this.camera, this.container );
      	this.controls.noPan = true; 

		this.container.appendChild( this.renderer.domElement );

      	if( debug ) {

	    	this.stats = new Stats();
	    	this.stats.domElement.style.top = "0px";
	    	this.stats.domElement.style.position = "absolute";
	    	this.container.appendChild( this.stats.domElement );
      	}

      	self = this;
      	this.renderer.render(this.scene, this.camera);
	};

	this.onResize = function( ) {

		this.camera.aspect = this.container.clientWidth/this.container.clientHeight;
      	this.camera.updateProjectionMatrix();
      	this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
      	console.log( "Explore Resized to: " + this.container.clientWidth + " " + this.container.clientHeight );
	};

	this.onLeftClick = function( event ) {

		event.preventDefault();
		var x = ( event.clientX / self.container.clientWidth  ) * 2 - 1;
		var y = - ( (event.clientY-30) / self.container.clientHeight ) * 2 + 1;
		var z = 0.5;

		var vector = new THREE.Vector3(x,y,z);
		self.projector.unprojectVector( vector, self.camera );
		var raycaster = new THREE.Raycaster( self.camera.position, vector.sub( self.camera.position ).normalize() );
		
		var intersects = raycaster.intersectObjects( self.scene.children );

		if(this.visCtrl) {
			self.visCtrl.onLeftClick( intersects );
		}
	};

	this.onRightClick = function( event ) {

		if(this.visCtrl) {
			this.visCtrl.onRightClick();
		}
	};

	this.onHover = function( event ) {

		event.preventDefault();
		var x = ( event.clientX / self.container.clientWidth  ) * 2 - 1;
		var y = - ( (event.clientY-30) / self.container.clientHeight ) * 2 + 1;
		var z = 1;

		var vector = new THREE.Vector3(x,y,z);
		self.projector.unprojectVector( vector, self.camera );
		var raycaster = new THREE.Raycaster( self.camera.position, vector.sub( self.camera.position ).normalize() );
		
		var intersects = raycaster.intersectObjects( self.scene.children );

		if(this.visCtrl) {
			self.visCtrl.onHover( intersects );
		}
	};

	this.start = function() {

		var self = this;
		console.log("Explore starting loop");

		render();

		function render( ) {

			self.frameId = requestAnimationFrame( render );
	     	self.renderer.render( self.scene, self.camera );
			self.controls.update();
	        
	        if( self.stats ) {
	            self.stats.update();
	        }

	        update( self.clock.getDelta() );

		};
	};

	this.stop = function() {

		console.log("Explore stopping loop");
		
		cancelAnimationFrame( this.frameId );
	};

	function update( delta ) {

		if( self.visCtrl ) {
			self.visCtrl.update( delta );
		}
	};
	
	this.addCtrl = function( ctrl ) {

		//You need to go back to front, not front to back
		//http://stackoverflow.com/questions/11678497/cant-remove-objects-using-three-js
		for(var i = this.scene.children.length - 1; i >= 0 ; i --) {

			this.scene.remove( this.scene.children[i] );
		}

		this.visCtrl = ctrl;
		this.visCtrl.init( this.camera, this.controls, this.scene );
	};
};