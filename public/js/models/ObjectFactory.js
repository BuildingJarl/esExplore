/*
    Ivan Bacher
    C10736831
    ivan.bacher@mydit.ie

    Model

    This model uses the threejs rendering library
    all calls to the library are prefixed with THREE.****
*/

'use strict'


ES_EX.ObjectFactory = function( ) {


    //glowing/clear spheres from http://stemkoski.github.io/Three.js/
	var globalMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color( 0x7804A6 ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:0} }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: true
	});

    //glowing/clear spheres from http://stemkoski.github.io/Three.js/
	var fileGlobalMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color(  0x1775FF ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:0} }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: true
		//wireframe: true
	});

    //glowing/clear spheres from http://stemkoski.github.io/Three.js/
	var scopeMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1 },
			"p":   { type: "f", value: 2 },
			glowColor: { type: "c", value: new THREE.Color( 0x00ff00 ) },
			viewVector: { type: "v3", value: {x:0, y:0, z:0} }
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

	this.createGlobalScopeSphere = function( radius, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, globalMaterial );
    	obj.scale.set(radius,radius,radius);

    	obj.position = pos;
        obj.userData.color = '120,4,166'
    	return obj;
    };
    
    this.createFileGlobalScopeSphere = function( radius, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, fileGlobalMaterial.clone() );
    	var scale =  radius ;
    	obj.scale.set(scale,scale,scale);

    	obj.position = pos;
        obj.userData.color = '23,117,255'
    	return obj;
    };

    this.createScopeSphere = function( radius, depth, pos ) {

    	var obj = new THREE.Mesh( sphereGeo, scopeMaterial.clone() );

    	var col = new THREE.Color( 0x00ff00 );
    	obj.material.uniforms.glowColor.value = col; 

    	switch(depth) {

    		case 2: {
    			var col = new THREE.Color( 0x00ff00 );
    			obj.material.uniforms.glowColor.value = col;
                obj.userData.color = '0,255,0';
    			break;
    		};
    		case 3: {
    			var col = new THREE.Color( 0xF5FF00 );
    			obj.material.uniforms.glowColor.value = col;
                obj.userData.color = '245,255,0'; 
    			break;
    		};

    		case 4: {
    			var col = new THREE.Color( 0xFF8E00 );
    			obj.material.uniforms.glowColor.value = col;
                obj.userData.color = '255,142,0';  
    			break;
    		};

    		case 5: {
    			var col = new THREE.Color( 0xFF1E00 );
    			obj.material.uniforms.glowColor.value = col;
                obj.userData.color = '255,30,0';  
    			break;
    		};


    		default: {
    			var col = new THREE.Color( 0xfffff );
    			obj.material.uniforms.glowColor.value = col;
                obj.userData.color = '255,255,255'; 
    			break; 
    		};
    	}

    	var scale =  radius ;
    	obj.scale.set(scale,scale,scale);

    	obj.position = pos;
    	return obj;
    };
};
