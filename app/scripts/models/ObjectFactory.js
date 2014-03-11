'use strict'

ES_EX.ObjectFactory = function( ) {

	var globalMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color( 0xff00ff ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:10000} }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: true
	});

	var fileGlobalMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color(  0xFD0987 ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:10000} }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: true
		//wireframe: true
	});

	var scopeMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color( 0x00ff00 ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:10000} }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: true
		//wireframe: true
	});

	var sphereGeo = new THREE.SphereGeometry( 1, 32, 16 );

	var selectedSpriteMaterial = new THREE.SpriteMaterial({ 
		
		map: new THREE.ImageUtils.loadTexture( 'images/glow.png' ), 
		color: 0xF3F315, 
		transparent: true,
		blending: THREE.AdditiveBlending
	});

	this.createGlobalScopeSphere = function( radius, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, globalMaterial );
    	obj.scale.set(radius,radius,radius);

    	var sprite = new THREE.Sprite( selectedSpriteMaterial.clone() );
    	sprite.scale.set( radius*3, radius*3, 1 );
    	sprite.name = "selected";
    	sprite.visible = false;
    	obj.add( sprite );
    	obj.position = pos;
    	return obj;
    };
    
    this.createFileGlobalScopeSphere = function( radius, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, fileGlobalMaterial.clone() );
    	var scale =  radius ;
    	obj.scale.set(scale,scale,scale);

    	var sprite = new THREE.Sprite( selectedSpriteMaterial.clone() );
    	sprite.scale.set( radius*3, radius*3, 1 );
    	sprite.name = "selected";
    	sprite.visible = false;

    	obj.add( sprite );
    	obj.position = pos;
    	return obj;
    };

    this.createScopeSphere = function( radius, depth, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, scopeMaterial.clone() );
    	var col = new THREE.Color( 0x00ff00 );
    	obj.material.uniforms.glowColor.value = col; 
    	var scale =  radius ;
    	obj.scale.set(scale,scale,scale);

    	var sprite = new THREE.Sprite( selectedSpriteMaterial.clone() );
    	sprite.scale.set( radius*3, radius*3, 1 );
    	sprite.name = "selected";
    	sprite.visible = false;
    	obj.add( sprite );

    	return obj;
    };

    this.createLabel = function( text, pos ) {

    	var element = document.createElement('span');
    	element.textContent = text;

    	var obj = new THREE.CSS3DObject( element );
    	obj.position = pos;

    	return obj;
    };
};
