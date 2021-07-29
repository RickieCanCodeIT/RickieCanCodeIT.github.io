
//////////////////////////////////////////////////////////////////
//
//  This example is similar to code03.html, but I am showing you how to
//  use gl elemenntary array, i.e, triangle indices, to draw faces 
//

var gl;
var shaderProgram;
var draw_type=2; 

// set up the parameters for lighting 
  var light_ambient = [0,0,0,1]; 
  var light_diffuse = [.8,.8,.8,1];
  var light_specular = [1,1,1,1]; 
  var light_pos = [0,10,0,1];   // eye space position 

  var mat_ambient = [0, 0, 0, 1]; 
  var mat_diffuse= [1, 1, 1, 1]; 
  var mat_specular = [.9, .9, .9,1]; 
  var mat_shine = [50]; 
  
//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

    
	var nonprimitiveBuffers;
	
	var cubeBuffers;
	var cylinderBuffers;
	var sphereBuffers;
	
	
	var eyeMatrix;
	var coiMatrix;
	var upMatrix;
	var upRotation;
	var mvMatrix1;
	var GunAngle;
	var zoomAmount

   ////////////////    Initialize VBO  ////////////////////////

    function initBuffers() {
		//set up default values
		eyeMatrix = [
			0, 0, 0, 10,
			0, 0, 0, 12,
			0, 0, 0, -2,
			0, 0, 0, 1];
		coiMatrix = [
			0, 10, 0];
		upMatrix = [
			0, 1, 0];
			zoomAmount = 10;
		upRotation = 0;
		GunAngle = 0;
			cubeBuffers = [];
			cylinderBuffers = [];
			sphereBuffers = [];
			
			// set up nonprimitives
		
		var groundVerts = [
		50, -3, 50,
		-50, -3, 50,
		-50, -3, -50,
		50, -3, -50];
		
		var groundNormals = [
		0, 1.0, 0,
		0, 1.0, 0,
		0, 1.0, 0,
		0, 1.0, 0];
		
		var groundColors = [
		.3, 0.8, 0.1, 1.0,
		.3, 0.8, 0.1, 1.0,
		.3, 0.8, 0.1, 1.0,
		.3, 0.8, 0.1, 1.0];
		
		var groundIndices = [0,1,2, 0,2,3];
		
		var skyVerts = [
		50, -3, 50,
		-50, -3, 50,
		-50, -3, -50,
		50, -3, -50,
		50, 50, 50,
		-50, 50, 50,
		-50, 50, -50,
		50, 50, -50,];
		
		var skyNormals = [
		-1, 0, -1,
		1, 0, -1,
		1, 0, 1,
		-1, 0, 1,
		-1, -1, -1,
		1, -1, -1,
		1, -1, 1,
		-1, -1, 1,];
		
		var skyColors = [
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.8, 1.0, 1.0, 1.0,
		0.8, 1.0, 1.0, 1.0,
		0.8, 1.0, 1.0, 1.0,
		0.8, 1.0, 1.0, 1.0];
		
		var skyIndices = [0,4,5, 
		0,1,5, 
		1, 5, 6, 
		1, 2, 6,
		2, 6, 7,
		2, 3, 7,
		3, 4, 7,
		3, 0, 4,
		4, 5, 6,
		4, 6, 7];
		
		var skyPositionBuffer;
		var skyNormalBuffer;
		var skyVertexColorBuffer;
		var skyVertexIndexBuffer; 
		var groundPositionBuffer;
		var groundNormalBuffer;
		var groundColorBuffer;
		var groundIndexBuffer;
		
        groundPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, groundPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundVerts), gl.STATIC_DRAW);
        groundPositionBuffer.itemSize = 3;
        groundPositionBuffer.numItems = 4;
		
        groundNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, groundNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundNormals), gl.STATIC_DRAW);
        groundNormalBuffer.itemSize = 3;
        groundNormalBuffer.numItems = 4;
        
		groundColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, groundColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundColors), gl.STATIC_DRAW);
        groundColorBuffer.itemSize = 4;
        groundColorBuffer.numItems = 4;

		groundIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groundIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(groundIndices), gl.STATIC_DRAW);  
        groundIndexBuffer.itemsize = 1;
        groundIndexBuffer.numItems = 6;  
		
        skyPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, skyPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyVerts), gl.STATIC_DRAW);
        skyPositionBuffer.itemSize = 3;
        skyPositionBuffer.numItems = 8;
		
        skyNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, skyNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyNormals), gl.STATIC_DRAW);
        skyNormalBuffer.itemSize = 3;
        skyNormalBuffer.numItems = 8;
        
		skyColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, skyColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyColors), gl.STATIC_DRAW);
        skyColorBuffer.itemSize = 4;
        skyColorBuffer.numItems = 8;

		skyIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(skyIndices), gl.STATIC_DRAW);  
        skyIndexBuffer.itemsize = 1;
        skyIndexBuffer.numItems = 30; 
		
		nonprimitiveBuffers = [
		groundPositionBuffer, groundNormalBuffer, groundColorBuffer, groundIndexBuffer,
		skyPositionBuffer, skyNormalBuffer, skyColorBuffer, skyIndexBuffer];
		
		//add primitive buffers
		
		addCubeBuffers(3, [.8, .8, 0.5, 1.0]);
		
		addCylinderBuffers(1, 1, 6, 60, 4, [.8, 0.52, 0.25, 1.0]);
		addCylinderBuffers(6, 1, 3, 4, 4, [.72, 0.52, 0.04, 1.0]);
		addCylinderBuffers(5, 2, 2, 60, 4, [.46, .53, .6, 1.0]);
		addCylinderBuffers(1, 1, 1, 12, 2, [.46, .53, .6, 1.0]);
		addCylinderBuffers(.5, .5, 2.5, 40, 2, [.46, .53, .6, 1.0]);
		
		addSphereBuffers(3, 40, 40, [0, .4, 0, 1]);
		addSphereBuffers(2, 40, 40, [1.0, .89, .87, 1]);
    }
	
	//Adds a cube buffer to the global list which can be used in the scene using the values passed in.
	function addCubeBuffers(size, color) {
		//set up vertexes for cube
		var cubePositionBuffer;
		var cubeNormalBuffer;
		var cubeColorBuffer;
		var cubeIndexBuffer;
		var vertices = [
             size,  size,  -size,
			-size,  size,  -size, 
			- size, -size,  -size,
			size, -size,  -size,
             size,  size,  size,
			-size,  size,  size, 
            -size, -size,  size,
			size, -size,  size,	    
	    
        ];
		
		var normals = [
			1.0, 1.0, -1.0,
			-1.0, 1.0, -1.0,
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0
		];

        var colors = [
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3],  
            color[0], color[1], color[2], color[3]
        ];
		
		var indices = [0,1,2, 0,2,3, 0,3,7, 0, 7,4, 6,2,3,6,3,7,5,1,2, 5,2,6,5,1,0,5,0,4,5,6,7,5,7,4];
		//create cube buffers
        cubePositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubePositionBuffer.itemSize = 3;
        cubePositionBuffer.numItems = 8;
		
        cubeNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        cubeNormalBuffer.itemSize = 3;
        cubeNormalBuffer.numItems = 8;
		
        cubeColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        cubeColorBuffer.itemSize = 4;
        cubeColorBuffer.numItems = 8;

		cubeIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
        cubeIndexBuffer.itemsize = 1;
        cubeIndexBuffer.numItems = 36;  
		
		//add cube buffers to global list
		cubeBuffers.push(cubePositionBuffer);
		cubeBuffers.push(cubeNormalBuffer);
		cubeBuffers.push(cubeColorBuffer);
		cubeBuffers.push(cubeIndexBuffer);
	}
	
	//Adds a cylinder buffer to the global list which can be used in the scene using the values passed in.
	function addCylinderBuffers(baseRadius, topRadius, height, numSlices, numStacks, color) {
		var cylinderPositionBuffer;
		var cylinderNormalBuffer;
		var cylinderColorBuffer;
		var cylinderIndexBuffer;
		
		var cylinder_indices = [];
		//Circle Vertex Position List
		var cylinder_vertices = [
		0.0, height / 2.0, 0.0];
		var cylinder_colors = [
		color[0], color[1], color[2], color[3]];
		var cylinder_normal = [0.0, 1.0, 0.0]; 
		var Dangle = 2*Math.PI/(numSlices);
		//var Slant = (baseRadius - topRadius) / height;
		var hypotenuse =  Math.sqrt(Math.pow(baseRadius - topRadius, 2) + Math.pow(height, 2));
		var halfHyp = hypotenuse / 2;
		var Slant = halfHyp / height;
		//add top of cylinder 
		for (counter = 0; counter < numSlices; counter++)
		{
			var angle = Dangle * counter; 
			cylinder_vertices.push(Math.sin((counter * 2 * Math.PI) / numSlices) * topRadius);
			cylinder_vertices.push(height / 2);
			cylinder_vertices.push(Math.cos((counter * 2 * Math.PI) / numSlices) * topRadius);
			cylinder_normal.push(Math.cos(angle)); 
			cylinder_normal.push(Slant);
			cylinder_normal.push(Math.sin(angle)); 
			cylinder_colors.push(color[0]);
			cylinder_colors.push(color[1]);
			cylinder_colors.push(color[2]);
			cylinder_colors.push(color[3]);
			if (counter < numSlices - 1) {
				cylinder_indices.push(0);
				cylinder_indices.push(counter + 1);
				cylinder_indices.push(counter + 2);
			}
			if (counter == numSlices - 1) {
			
				cylinder_indices.push(0);
				cylinder_indices.push(1);
				cylinder_indices.push(numSlices);
			}
		}
		//adds body and bottom of cylinder
		for (stackCounter = 0; stackCounter < numStacks; stackCounter++) {
			for (counter = 0; counter < numSlices; counter++)
			{
				var angle = Dangle * counter; 
				cylinder_vertices.push(Math.sin((counter * 2 * Math.PI) / numSlices) * ((baseRadius - topRadius) * (stackCounter + 1) / numStacks + topRadius));
				cylinder_vertices.push(height / 2 - height * (stackCounter + 1) / numStacks);
				cylinder_vertices.push(Math.cos((counter * 2 * Math.PI) / numSlices) * ((baseRadius - topRadius) * (stackCounter + 1) / numStacks + topRadius));
				cylinder_normal.push(Math.cos(angle)); 
				cylinder_normal.push(Slant);
				cylinder_normal.push(Math.sin(angle)); 
				cylinder_colors.push(color[0]);
				cylinder_colors.push(color[1]);
				cylinder_colors.push(color[2]);
				cylinder_colors.push(color[3]);
				cylinder_indices.push(((stackCounter + 1) * numSlices) + 1 + counter);
				cylinder_indices.push(stackCounter * numSlices + counter + 1);
				cylinder_indices.push(stackCounter * numSlices + counter + 2);
				if (counter < numSlices - 1) {
					cylinder_indices.push(((stackCounter + 1) * numSlices) + 1 + counter);
					cylinder_indices.push(((stackCounter + 1) * numSlices) + 2 + counter);
					cylinder_indices.push(stackCounter * numSlices + counter + 2);
				}
				if (counter == numSlices - 1) {
					cylinder_indices.push(((stackCounter + 1) * numSlices) + 1);
					cylinder_indices.push(stackCounter * numSlices + 1);
					cylinder_indices.push(((stackCounter + 1) * numSlices));
					
					
				}
				if ( stackCounter == numStacks - 1) {
					if (counter < numSlices - 1) {
						cylinder_indices.push(((stackCounter + 1) * numSlices) + 1 + counter);
						cylinder_indices.push(((stackCounter + 1) * numSlices) + 2 + counter);
						cylinder_indices.push((numStacks + 1) * numSlices + 1);
					}
					else {
						cylinder_indices.push((numStacks + 1) * numSlices);
						cylinder_indices.push((stackCounter + 1) * numSlices + 1);
						cylinder_indices.push((numStacks + 1) * numSlices + 1);
					}
				}
			}
		}
		cylinder_vertices.push(0.0);
		cylinder_vertices.push(-height / 2.0);
		cylinder_vertices.push(0.0);
		cylinder_normal.push(0.0); 
		cylinder_normal.push(-1.0);
		cylinder_normal.push(0.0); 
		cylinder_colors.push(color[0]);
		cylinder_colors.push(color[1]);
		cylinder_colors.push(color[2]);
		cylinder_colors.push(color[3]);
		
		//makes cylinder buffers
        cylinderPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder_vertices), gl.STATIC_DRAW);
        cylinderPositionBuffer.itemSize = 3;
        cylinderPositionBuffer.numItems = 2 + numStacks * numSlices;
		
        cylinderNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder_normal), gl.STATIC_DRAW);
        cylinderNormalBuffer.itemSize = 3;
        cylinderNormalBuffer.numItems = 2 + numStacks * numSlices;  

        cylinderColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder_colors), gl.STATIC_DRAW);
        cylinderColorBuffer.itemSize = 4;
        cylinderColorBuffer.numItems = 2 + numStacks * numSlices;
		
		cylinderIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinder_indices), gl.STATIC_DRAW);  
        cylinderIndexBuffer.itemsize = 1;
        cylinderIndexBuffer.numItems = 2 * numSlices * 3 + numStacks * numSlices * 6;  
		
		//adds cylinder buffers to the global list
		cylinderBuffers.push(cylinderPositionBuffer);
		cylinderBuffers.push(cylinderNormalBuffer);
		cylinderBuffers.push(cylinderColorBuffer);
		cylinderBuffers.push(cylinderIndexBuffer);
	}
	
	//Adds a sphere buffer to the global list which can be used in the scene using the values passed in.
	function addSphereBuffers(radius, numSlices, numStacks, color) {
		var spherePositionBuffer;
		var sphereNormalBuffer;
		var sphereColorBuffer;
		var sphereIndexBuffer;
		
		var sphere_indices = [];
		var sphere_vertices = [
		0.0, radius, 0.0,
		0.0, -radius, 0.0];
		var sphere_colors = [
		color[0], color[1], color[2], color[3],
		color[0], color[1], color[2], color[3]];
		var sphere_normal = [0.0, 1.0, 0.0,
								0.0, -1.0, 0.0]; 
		var Dangle = 2*Math.PI/(numSlices);
		//creates sphere vertexes, colors, and indexes
		for (counterLat = 1; counterLat < numStacks; counterLat++) {
			for (counterLong = 0; counterLong < numSlices; counterLong++) {
				var Yangle = (numStacks - counterLat - numStacks / 2) / (numStacks / 2);
				var angle = Dangle * counterLong; 
				sphere_vertices.push(Math.cos((counterLong / numSlices) * 2 * Math.PI) * Math.sin(Math.abs(counterLat) / numStacks * Math.PI) * radius); //* (1 - Math.abs((8 - counterLat) / 8.0)) * .5);
				sphere_vertices.push(Math.cos(Math.abs(counterLat) / numStacks * Math.PI) * radius);
				sphere_vertices.push(Math.sin((counterLong / numSlices) * 2 * Math.PI) * Math.sin(Math.abs(counterLat) / numStacks * Math.PI) * radius); //* (1 - Math.abs((8 - counterLat) / 8.0)) * .5);
				sphere_normal.push(Math.cos(angle)); 
				sphere_normal.push(Yangle);
				sphere_normal.push(Math.sin(angle)); 
				sphere_colors.push(color[0]);
				sphere_colors.push(color[1]);
				sphere_colors.push(color[2]);
				sphere_colors.push(color[3]);
				if (counterLat == 1) {
					if (counterLong < numSlices - 1) {
						sphere_indices.push(0);
						sphere_indices.push(2 + counterLong);
						sphere_indices.push(3 + counterLong);
					}
					if (counterLong == numSlices - 1) {
						sphere_indices.push(0);
						sphere_indices.push(2);
						sphere_indices.push(2 + counterLong);
					}
				}
				else if (counterLat > 1) {
					sphere_indices.push(2 + counterLong + (counterLat - 2) * numSlices);
					sphere_indices.push(3 + counterLong + (counterLat - 2) * numSlices);
					sphere_indices.push(2 + counterLong + (counterLat - 1) * numSlices);
					if (counterLong < numSlices - 1) {
						sphere_indices.push(3 + counterLong + (counterLat - 2) * numSlices);
						sphere_indices.push(2 + counterLong + (counterLat - 1) * numSlices);
						sphere_indices.push(3 + counterLong + (counterLat - 1) * numSlices);
					}
					if (counterLong == numSlices - 1) {
						sphere_indices.push(2 + (counterLat - 2) * numSlices); //Top Right
						sphere_indices.push(2 + (counterLat - 1) * numSlices);//Bottom Right
						sphere_indices.push(2 + counterLong + (counterLat - 2) * numSlices);
						
					}
					if (counterLat == numStacks - 1) {
						if (counterLong < numSlices - 1) {
							sphere_indices.push(1);
							sphere_indices.push(2 + counterLong + (counterLat - 1) * numSlices);
							sphere_indices.push(3 + counterLong + (counterLat - 1) * numSlices);
						}
						else {
							sphere_indices.push(1);
							sphere_indices.push(2 + (counterLat - 1) * numSlices);
							sphere_indices.push(2 + counterLong + (counterLat - 1) * numSlices);
						}
					}
				}
			}
		}
		
		//create sphere buffers
		spherePositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere_vertices), gl.STATIC_DRAW);
        spherePositionBuffer.itemSize = 3;
        spherePositionBuffer.numItems = (numStacks - 1) * numSlices + 2;
		
		sphereNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere_normal), gl.STATIC_DRAW);
        sphereNormalBuffer.itemSize = 3;
        sphereNormalBuffer.numItems = (numStacks - 1) * numSlices + 2;
		
        sphereColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere_colors), gl.STATIC_DRAW);
        sphereColorBuffer.itemSize = 4;
        sphereColorBuffer.numItems = (numStacks - 1) * numSlices + 2;
		
		sphereIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere_indices), gl.STATIC_DRAW);  
        sphereIndexBuffer.itemsize = 1;
        sphereIndexBuffer.numItems = numSlices * 3 + (numStacks - 2) * numSlices * 6 + numSlices * 3; 
		
		//add sphere buffers to global list
		sphereBuffers.push(spherePositionBuffer);
		sphereBuffers.push(sphereNormalBuffer);
		sphereBuffers.push(sphereColorBuffer);
		sphereBuffers.push(sphereIndexBuffer);
		
	}

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    var mMatrix = mat4.create();  // model matrix
    var vMatrix = mat4.create(); // view matrix
    var pMatrix = mat4.create();  //projection matrix
    var nMatrix = mat4.create();  // normal matrix
    var Z_angle = 0.0;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);	
	
    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }
	 
	 //shows a UFO
	 function draw_UFO(matrix) {
		draw_cylinder(matrix, 2);
		matrix = mat4.translate(matrix, [0, -1.5, 0]);
		draw_cylinder(matrix, 3);
		matrix = mat4.translate(matrix, [0, -2, 0]);
		draw_sphere(matrix, 1);
		matrix = mat4.rotateZ(matrix, GunAngle);
		matrix = mat4.translate(matrix, [3, 0, 0]);
		console.log('Gun Angle: ' + GunAngle);
		matrix = mat4.rotateZ(matrix, Math.PI / 2.0);
		draw_cylinder(matrix, 4);
	 }
	 
	 //shows a tree
	 function draw_tree(matrix) {
		matrix = mat4.translate(matrix, [0, 3, 0]);
		draw_cylinder(matrix, 0);
		matrix = mat4.translate(matrix, [0, 10, 0]);
		draw_sphere(matrix, 0);
	 }
	 
	 //shows a house
	 function draw_house(matrix) {
		draw_cube(matrix, 0);
		//matrix = mat4.scale(matrix, [2, 0, 0]);
		matrix = mat4.translate(matrix, [0, 9, 0]);
		matrix = mat4.rotateY(matrix, Math.PI / 4);
		//matrix = mat4.scale(matrix, [.5, 0, 0]);
		draw_cylinder(matrix, 1);
	 }
	 
	 //shows a nonprimitive (used for ground and sky)
	 function draw_nonprimitive(matrix, type) {
        setMatrixUniforms(matrix);	
		
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, nonprimitiveBuffers[type * 4]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, nonprimitiveBuffers[type * 4].itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, nonprimitiveBuffers[type * 4 + 1]);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,nonprimitiveBuffers[type * 4 + 1].itemSize, gl.FLOAT, false, 0, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, nonprimitiveBuffers[type * 4 + 2]);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,nonprimitiveBuffers[type * 4 + 2].itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, nonprimitiveBuffers[type * 4 + 3]); 
		gl.drawElements(gl.TRIANGLES, nonprimitiveBuffers[type * 4 + 3].numItems , gl.UNSIGNED_SHORT, 0)
	 }
	 
	 //Draws a cube using the matrix
    function draw_cube(matrix, type) {

        setMatrixUniforms(matrix);	
	
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffers[type * 4]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeBuffers[type * 4].itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffers[type * 4 + 1]);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderBuffers[type * 4 + 1].itemSize, gl.FLOAT, false, 0, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffers[type * 4 + 2]);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cubeBuffers[type * 4 + 2].itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffers[type * 4 + 3]); 
		gl.drawElements(gl.TRIANGLES, cubeBuffers[type * 4 + 3].numItems , gl.UNSIGNED_SHORT, 0)
    }
	 
	 //Draws a cylinder using the matrix
    function draw_cylinder(matrix, type) {

        setMatrixUniforms(matrix);	
	
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffers[type * 4]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderBuffers[type * 4].itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffers[type * 4 + 1]);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderBuffers[type * 4 + 1].itemSize, gl.FLOAT, false, 0, 0);
	
        //gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffers[type * 4 + 2]);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cylinderBuffers[type * 4 + 2].itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffers[type * 4 + 3]); 
		gl.drawElements(gl.TRIANGLES, cylinderBuffers[type * 4 + 3].numItems , gl.UNSIGNED_SHORT, 0);
    }
	
	//Draws a sphere using the matrix
    function draw_sphere(matrix, type) {

        setMatrixUniforms(matrix);	
	
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers[type * 4]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereBuffers[type * 4].itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers[type * 4 + 1]);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereBuffers[type * 4 + 1].itemSize, gl.FLOAT, false, 0, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers[type * 3 + 2]);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,sphereBuffers[type * 3 + 2].itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffers[type * 4 + 3]); 
		gl.drawElements(gl.TRIANGLES, sphereBuffers[type * 4 + 3].numItems , gl.UNSIGNED_SHORT, 0);
    }
    ///////////////////////////////////////////////////////////////

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		pMatrix = mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

		vMatrix = mat4.lookAt([eyeMatrix[3],eyeMatrix[7],eyeMatrix[11]], coiMatrix, upMatrix, vMatrix);	// set up the view matrix

        mat4.identity(mMatrix);	 //initializes model matrix
		mat4.identity(nMatrix); 
		nMatrix = mat4.multiply(nMatrix, vMatrix);
		nMatrix = mat4.multiply(nMatrix, mMatrix); 	
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix); 

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");


		gl.uniform4f(shaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
		gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
		gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
		gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
		gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 

		gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
		gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
		gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 
		//shows nonprimitives
		draw_nonprimitive(mMatrix, 0);
		draw_nonprimitive(mMatrix, 1);
		
		//show trees
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [5, 0, 5]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-5, 0, -5]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-8, 0, 3]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [9, 0, -8]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [15, 0, -23]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-17, 0, -32]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-19, 0, 22]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [27, 0, 29]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-35, 0, 17]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [-33, 0, -29]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [37, 0, -22]);
		draw_tree(mMatrix);
		mMatrix = PopMatrix();
		
		//shows houses
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [0, 3, -15]);
		draw_house(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		mMatrix = mat4.translate(mMatrix, [0, 3, 15]);
		draw_house(mMatrix);
		mMatrix = PopMatrix();
		
		PushMatrix(mMatrix);
		//shows UFO
        mMatrix = mat4.multiply(mMatrix, mvMatrix1); 
		mMatrix = mat4.translate(mMatrix, [0, 10, 0]);
		draw_UFO(mMatrix);
		mMatrix = PopMatrix();
		

       setMatrixUniforms();   // pass the modelview matrix and projection matrix to the shader 


    }
	
	var mvMatrixStack = [];

	//pushes matrices
    function PushMatrix(matrix) {
        var copy = mat4.create();
        mat4.set(matrix, copy);
        mvMatrixStack.push(copy);
    }
	
	//pops matrices
    function PopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        var copy = mvMatrixStack.pop();
	return copy; 
    }
	// Set up on key down
    function onKeyDown(event) {

      console.log(event.keyCode);
      switch(event.keyCode)  {
		 case 97:
		 case 37:
			//1 translates light left
			console.log('enter 1');
			moveLight(-1, 0, 0);
		 break;
		 case 101:
		 case 38:
			//5 translates light forward
			console.log('enter 5');
			moveLight(0, 0, 1);
		 break;
		 case 99:
		 case 39:
			//3 translates light Right
			console.log('enter 3');
			moveLight(1, 0, 0);
		 break;
		 case 98:
		 case 40:
			//2 translates light backward
			console.log('enter 2');
			moveLight(0, 0, -1);
		 break;
		 case 105:
		 case 222:
			//9 translates light up
			console.log('enter 9');
			moveLight(0, 1, 0);
		 break;
		 case 102:
		 case 191:
			//6 translates light down
			console.log('enter 6');
			moveLight(0, -1, 0);
		 break;
		 case 103:
		 case 186:
			//7 increases light intensity
			console.log('enter 7');
			changeDiffuse(1.2);
		 break;
		 case 100:
		 case 190:
			//4 decreases light intensity
			console.log('enter 4');
			changeDiffuse(.8);
		 break;
		 case 70:
			//f translates forward
			console.log('enter f');
			mvMatrix1 = mat4.translate(mvMatrix1, [1, 0, 0]);	
		 break;
		 case 66:
			//b translates backwards
			console.log('enter b');
			mvMatrix1 = mat4.translate(mvMatrix1, [-1, 0, 0]);	
		 break;
		 case 82:
			//r translates right
			console.log('enter r');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, 0, 1]);	
		 break;
		 case 76:
			//l translates left
			console.log('enter l');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, 0, -1]);	
		 break;
		 case 85:
			//u translates up
			console.log('enter u');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, 1, 0]);	
		 break;
		 case 68:
			//d translates down
			console.log('enter d');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, -1, 0]);	
		 break;
         case 81:
              
			//q rotates UFO Left
			console.log('enter q');
			mvMatrix1 = mat4.rotateY(mvMatrix1, Math.PI / 8);		
         break;
         case 65:
          
			//a rotates UFO Right
			console.log('enter a');
			mvMatrix1 = mat4.rotateY(mvMatrix1, -Math.PI / 8);		  		      
			
         break;
         case 87:
              
			//w rotates UFO Gun up
			console.log('enter w');
			GunAngle += Math.PI / 8;
			if (GunAngle > 0) {
				GunAngle = 0;
			}	  		
         break;
         case 83:
          
			//a rotates UFO Gun down
			console.log('enter s');   
			GunAngle -= Math.PI / 8;
			if (GunAngle < -Math.PI / 2) {
				GunAngle = -Math.PI / 2;
			}   
			
         break;
       }
       drawScene();
    }


    ///////////////////////////////////////////////////////////////

     var lastMouseX = 0, lastMouseY = 0;

    ///////////////////////////////////////////////////////////////
	
     function onDocumentMouseDown( event ) {
          event.preventDefault();
          document.addEventListener( 'mousemove', onDocumentMouseMove, false );
          document.addEventListener( 'mouseup', onDocumentMouseUp, false );
          document.addEventListener( 'mouseout', onDocumentMouseOut, false );
          var mouseX = event.clientX;
          var mouseY = event.clientY;

          lastMouseX = mouseX;
          lastMouseY = mouseY; 
        console.log('lastMouseX: '+ lastMouseX + ' lastMouseY: '+ lastMouseY); 

      }
	
		//controls mouse move
     function onDocumentMouseMove( event ) {
          var mouseX = event.clientX;
          var mouseY = event.clientY; 

          var diffX = mouseX - lastMouseX;
          var diffY = mouseY - lastMouseY;
		if (event.which === 1) {
		// rotates on left click
			eyeMatrix = mat4.rotateY(eyeMatrix, degToRad(diffX/5)); 
			eyeMatrix = mat4.rotateX(eyeMatrix, degToRad(diffY/5)); 

		}
		else if (event.which === 3) {
		// zooms on right click
			eyeMatrix[3] = eyeMatrix[3] / zoomAmount;
			eyeMatrix[7] = eyeMatrix[7] / zoomAmount;
			eyeMatrix[11] = eyeMatrix[11] / zoomAmount;
			zoomAmount += (diffY / 10);
			if (zoomAmount < .25) {
				zoomAmount = .25;
			}
			eyeMatrix[3] = eyeMatrix[3] * zoomAmount;
			eyeMatrix[7] = eyeMatrix[7] * zoomAmount;
			eyeMatrix[11] = eyeMatrix[11] * zoomAmount;
		}
		 
 

          lastMouseX = mouseX;
          lastMouseY = mouseY;

          drawScene();
     }

     function onDocumentMouseUp( event ) {
          document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

     function onDocumentMouseOut( event ) {
          document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

    ///////////////////////////////////////////////////////////////

    function webGLStart() {
        var canvas = document.getElementById("code03-canvas");
        initGL(canvas);
        initShaders();

	gl.enable(gl.DEPTH_TEST); 

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");	
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");	

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
        shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	
		document.addEventListener('keydown', onKeyDown, false);

        initBuffers(); 
		
		mvMatrix1 = mat4.create(); 
		mat4.identity(mvMatrix1);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        console.log('*****');
        console.error('nuuuuuuu');


       document.addEventListener('mousedown', onDocumentMouseDown,
       false); 

        drawScene();
    }

	//Moves eye
function MoveEye(type) {

    if (type == 0) {
	//move eye left
		eyeMatrix[3] -= 1;
	}
    else if (type == 1) {
	//move eye right
		eyeMatrix[3] += 1;
	}
    else if (type == 2) {
	//move eye forward
		eyeMatrix[11] += 1;
	}
    else if (type == 3) {
	//move eye backwards
		eyeMatrix[11] -= 1;
	}
    else if (type == 4) {
	//move eye up
		eyeMatrix[7] += 1;
	}
    else if (type == 5) {
	//move eye down
		eyeMatrix[7] -= 1;
	}
    drawScene(); 
} 
	//moves center of interest and rolls
function MoveCOI(type) {

    if (type == 0) {
	//move COI left
		coiMatrix[0] -= 1;
	}
    else if (type == 1) {
	//move COI right
		coiMatrix[0] += 1;
	}
    else if (type == 2) {
	//move COI forward
		coiMatrix[2] += 1;
	}
    else if (type == 3) {
	//move COI backwards
		coiMatrix[2] -= 1;
	}
    else if (type == 4) {
	//move COI up
		coiMatrix[1] += 1;
	}
    else if (type == 5) {
	//move COI down
		coiMatrix[1] -= 1;
	}
	else if (type == 6) {
	//Rolls view left
		upRotation += Math.PI / 4;
		if (upRotation > 2 * Math.PI) {
			upRotation = upRotation - Math.PI * 2;
		}
		upMatrix[0] = Math.sin(upRotation);
		upMatrix[1] = Math.cos(upRotation);
	}
	else if (type == 7) {
	//Rolls view right
		upRotation -= Math.PI / 4;
		if (upRotation < 0) {
			upRotation = upRotation + Math.PI * 2;
		}
		upMatrix[0] = Math.sin(upRotation);
		upMatrix[1] = Math.cos(upRotation);
	}
    drawScene(); 
} 

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

function moveLight(X, Y, Z) {
	light_pos[0] += X;
	light_pos[1] += Y;
	light_pos[2] += Z;
			console.log('X: ' + light_pos[0] + ' Y: ' + light_pos[1] + ' Z: ' + light_pos[2]);
}

function changeDiffuse(change) {
	light_diffuse[0] *= change;
	light_diffuse[1] *= change;
	light_diffuse[2] *= change;
			console.log('R: ' + light_diffuse[0] + ' G: ' + light_diffuse[1] + ' B: ' + light_diffuse[2]);
}

//redraws the scene
function redraw() {
		mat4.identity(mvMatrix1);
		eyeMatrix = [
			0, 0, 0, 10,
			0, 0, 0, 12,
			0, 0, 0, -2,
			0, 0, 0, 1];
		coiMatrix = [
			0, 10, 0];
		upMatrix = [
			0, 1, 0];
		upRotation = 0;
		GunAngle = 0;
			zoomAmount = 10;
			
  light_diffuse = [.8,.8,.8,1];
  light_pos = [0,10,0,1]; 
    drawScene();
}
    

function geometry(type) {

    draw_type = type;
    drawScene();

} 
