
//////////////////////////////////////////////////////////////////
//
//  Richard Kidwell's lab 5
//	Modified from professor Shen's example

var gl;
var shaderProgram;
var draw_type=2;
var use_texture = 1; 
var eyeMatrix;


  // set up the parameters for lighting 
  var light_ambient = [0,0,0,1]; 
  var light_diffuse = [.8,.8,.8,1];
  var light_specular = [1,1,1,1]; 
  var light_pos = [0,0,0,1];   // eye space position 

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

//Buffer objects
var geodudeVertexPositionBuffer;
var geodudeVertexNormalBuffer; 
var geodudeVertexTextureCoordBuffer; 
var geodudeVertexIndexBuffer;

var groundVertexPositionBuffer;
var groundVertexNormalBuffer; 
var groundVertexTextureCoordBuffer; 
var groundVertexIndexBuffer;

var caveWallVertexPositionBuffer1;
var caveWallVertexNormalBuffer1; 
var caveWallVertexPositionBuffer2;
var caveWallVertexNormalBuffer2; 
var caveWallVertexPositionBuffer3;
var caveWallVertexNormalBuffer3; 
var caveWallVertexPositionBuffer4;
var caveWallVertexNormalBuffer4; 
var caveWallVertexTextureCoordBuffer; 
var caveWallVertexIndexBuffer;

var caveCeilingVertexPositionBuffer;
var caveCeilingVertexNormalBuffer; 
var caveCeilingVertexTextureCoordBuffer; 
var caveCeilingVertexIndexBuffer;

var xmin, xmax, ymin, ymax, zmin, zmax;

function find_range(positions)
{
    console.log("hello!"); 
    xmin = xmax = positions[0];
    ymin = ymax = positions[1];
    zmin = zmax = positions[2];
    for (i = 0; i< positions.length/3; i++) {
	if (positions[i*3] < xmin) xmin = positions[i*3];
	if (positions[i*3] > xmax) xmax = positions[i*3]; 	

	if (positions[i*3+1] < ymin) ymin = positions[i*3+1];
	if (positions[i*3+1] > ymax) ymax = positions[i*3+1]; 	

	if (positions[i*3+2] < zmin) zmin = positions[i*3+2];
	if (positions[i*3+2] > zmax) zmax = positions[i*3+2]; 	
    }
    console.log("*****xmin = "+xmin + "xmax = "+xmax);
    console.log("*****ymin = "+ymin + "ymax = "+ymax);
    console.log("*****zmin = "+zmin + "zmax = "+zmax);     
} 

var geodudeTexture; 
var floorTexture;
var caveWallTexture;
var caveWallSignTexture;
var caveWallSwordsTexture;
var exitTexture;
var caveCeilingTexture;
var TexCount;

function initTextures() {
	TexCount = 0;
	//Making geodude texture, though it doesn't get used
    geodudeTexture = gl.createTexture();
    geodudeTexture.image = new Image();
    geodudeTexture.image.onload = function() { handleTextureLoaded(geodudeTexture); }
    geodudeTexture.image.src = "geotex.png";  
	//Making floor texture
    floorTexture = gl.createTexture();
    floorTexture.image = new Image();
    floorTexture.image.onload = function() { handleTextureLoaded(floorTexture); }
    floorTexture.image.src = "Tile.png";  
	//Making cave wall texture
    caveWallTexture = gl.createTexture();
    caveWallTexture.image = new Image();
    caveWallTexture.image.onload = function() { handleTextureLoaded(caveWallTexture); }
    caveWallTexture.image.src = "CaveWall.png"; 
	//Making cave wall with sign texture
    caveWallSignTexture = gl.createTexture();
    caveWallSignTexture.image = new Image();
    caveWallSignTexture.image.onload = function() { handleTextureLoaded(caveWallSignTexture); }
    caveWallSignTexture.image.src = "CaveWallSign.png"; 
	//Making cave wall with swords texture
    caveWallSwordsTexture = gl.createTexture();
    caveWallSwordsTexture.image = new Image();
    caveWallSwordsTexture.image.onload = function() { handleTextureLoaded(caveWallSwordsTexture); }
    caveWallSwordsTexture.image.src = "CaveWallSwords.png"; 
	//Making cave exit texture
    exitTexture = gl.createTexture();
    exitTexture.image = new Image();
    exitTexture.image.onload = function() { handleTextureLoaded(exitTexture); }
    exitTexture.image.src = "Exit.png"; 
	//Making cave ceiling texture
    caveCeilingTexture = gl.createTexture();
    caveCeilingTexture.image = new Image();
    caveCeilingTexture.image.onload = function() { handleTextureLoaded(caveCeilingTexture); }
    caveCeilingTexture.image.src = "CaveCeiling.png";    
    console.log("loading texture....") 
}

function handleTextureLoaded(texture) {
	//Handles texture being loaded
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
	console.error("draw");
	TexCount++;
	if (TexCount == 7) {
		//Once all textures have been loaded, initialize the cube map
		initCubeMap();
        
	}
}

var cubemapTexture;

function initCubeMap() {
	//Initializes cube map
	cubemapTexture = gl.createTexture();
	cubemapTexture.image = new Image();
	cubemapTexture.image.onload = function() { handleCubemapTextureLoaded(cubemapTexture); }
	cubemapTexture.image.src = "CaveWall.png"; 
	console.log("loading cubemap texture....");
} 

function handleCubemapTextureLoaded(texture) {
	// Load in a cube map
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
	//Load sides of the environment cube map
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, caveWallSwordsTexture.image); // again, different image each face
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, exitTexture.image);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, caveCeilingTexture.image);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorTexture.image);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, caveWallTexture.image);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, caveWallSignTexture.image); 
	console.log("Ran");
	drawScene();
}

////////////////    Initialize JSON geometry file ///////////
    var request;

function initJSON()
{
	//Loads in the geodude model.
    request = new  XMLHttpRequest();
//  request.open("GET", "triangle.json");
    request.open("GET", "geodude.json");    
    request.onreadystatechange =
      function () {
          if (request.readyState == 4) {
	      console.log("state ="+request.readyState); 
		  var inJSON = JSON.parse(request.responseText);
		  console.log(inJSON)
              handleLoadedgeodude(inJSON);
        }
      }
    request.send();
}


function handleLoadedgeodude(geodudeData)
{
	//Once the geodude is loaded, create all buffers
		eyeMatrix = [
			0, 0, 0, 1,
			0, 0, 0, 1,
			0, 0, 0, 1,
			0, 0, 0, 1];
    console.log(" in hand Loadedgeodude"); 
    console.log(geodudeData.meshes[0].vertices); 
    geodudeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geodudeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(geodudeData.meshes[0].vertices),gl.STATIC_DRAW);
    geodudeVertexPositionBuffer.itemSize=3;
    geodudeVertexPositionBuffer.numItems=geodudeData.meshes[0].vertices.length/3; 
    //Make geodud normal buffer
    geodudeVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  geodudeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geodudeData.meshes[0].normals), gl.STATIC_DRAW);
    geodudeVertexNormalBuffer.itemSize=3;
    geodudeVertexNormalBuffer.numItems= geodudeData.meshes[0].normals.length/3;
    
	//Make geodude texture coordinate buffer
    geodudeVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geodudeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(geodudeData.meshes[0].texturecoords[0]),
		  gl.STATIC_DRAW);
    geodudeVertexTextureCoordBuffer.itemSize=2;
    geodudeVertexTextureCoordBuffer.numItems=geodudeData.meshes[0].texturecoords[0].length/2;
		
	//Pull the data from the JSON into a form I can use, because the JSON file I got from clara.IO had it in a strange format
	var facesData = [];
	for (counter = 0; counter < geodudeData.meshes[0].faces.length; counter++) {
		facesData.push(geodudeData.meshes[0].faces[counter][0]);
		facesData.push(geodudeData.meshes[0].faces[counter][1]);
		facesData.push(geodudeData.meshes[0].faces[counter][2]);
	}

	//Make geodude index buffer
    geodudeVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geodudeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(facesData), gl.STATIC_DRAW);
    geodudeVertexIndexBuffer.itemSize=1;
    geodudeVertexIndexBuffer.numItems=facesData.length;

    find_range(geodudeData.meshes[0].vertices);
	
	console.log("Normals: " + geodudeVertexNormalBuffer.numItems);
	console.log("Textures: " + geodudeVertexTextureCoordBuffer.numItems);
	console.log("Indices: " + geodudeVertexIndexBuffer.numItems);

    console.log("*****xmin = "+xmin + "xmax = "+xmax);
    console.log("*****ymin = "+ymin + "ymax = "+ymax);
    console.log("*****zmin = "+zmin + "zmax = "+zmax); 

	//Create the floor

	var groundVerts = [
		40, -40, 40,
		-40, -40, 40,
		-40, -40, -40,
		40, -40, -40];
		
	var groundNormals = [
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
	];    
	var groundTexCoords = [0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]; 
		
	var groundIndices = [0,1,2, 0,2,3];	
		
		groundVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(groundVerts),gl.STATIC_DRAW);
    groundVertexPositionBuffer.itemSize=3;
    groundVertexPositionBuffer.numItems=4; 
    
    groundVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  groundVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundNormals), gl.STATIC_DRAW);
    groundVertexNormalBuffer.itemSize=3;
    groundVertexNormalBuffer.numItems= 4;
    
    groundVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(groundTexCoords),
		  gl.STATIC_DRAW);
    groundVertexTextureCoordBuffer.itemSize=2;
    groundVertexTextureCoordBuffer.numItems=4;
	
    groundVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groundVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(groundIndices), gl.STATIC_DRAW);
    groundVertexIndexBuffer.itemSize=1;
    groundVertexIndexBuffer.numItems=6;
	
	//Create walls
	var caveWallVerts1 = [
		40, 40, 40,
		-40, 40, 40,
		-40, -40, 40,
		40, -40, 40];
		
	var caveWallNormals1 = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
	];    
	var caveWallVerts2 = [
		40, 40, -40,
		40, 40, 40,
		40, -40, 40,
		40, -40, -40];
		
	var caveWallNormals2 = [
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
	];    
	var caveWallVerts3 = [
		-40, 40, -40,
		40, 40, -40,
		40, -40, -40,
		-40, -40, -40];
		
	var caveWallNormals3 = [
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
	];    
	var caveWallVerts4 = [
		-40, 40, 40,
		-40, 40, -40,
		-40, -40, -40,
		-40, -40, 40];
		
	var caveWallNormals4 = [
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
        ];    
		
	//All walls share the same indices and texture coordinates
	var caveWallTexCoords = [0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]; 
		
	var caveWallIndices = [0,1,2, 0,2,3];	
		
	caveWallVertexPositionBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveWallVerts1),gl.STATIC_DRAW);
    caveWallVertexPositionBuffer1.itemSize=3;
    caveWallVertexPositionBuffer1.numItems=4; 
    
    caveWallVertexNormalBuffer1 =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  caveWallVertexNormalBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(caveWallNormals1), gl.STATIC_DRAW);
    caveWallVertexNormalBuffer1.itemSize=3;
    caveWallVertexNormalBuffer1.numItems= 4;
		
	caveWallVertexPositionBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveWallVerts2),gl.STATIC_DRAW);
    caveWallVertexPositionBuffer2.itemSize=3;
    caveWallVertexPositionBuffer2.numItems=4; 
    
    caveWallVertexNormalBuffer2 =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  caveWallVertexNormalBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(caveWallNormals2), gl.STATIC_DRAW);
    caveWallVertexNormalBuffer2.itemSize=3;
    caveWallVertexNormalBuffer2.numItems= 4;
		
	caveWallVertexPositionBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveWallVerts3),gl.STATIC_DRAW);
    caveWallVertexPositionBuffer3.itemSize=3;
    caveWallVertexPositionBuffer3.numItems=4; 
    
    caveWallVertexNormalBuffer3 =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  caveWallVertexNormalBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(caveWallNormals3), gl.STATIC_DRAW);
    caveWallVertexNormalBuffer3.itemSize=3;
    caveWallVertexNormalBuffer3.numItems= 4;
		
	caveWallVertexPositionBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveWallVerts4),gl.STATIC_DRAW);
    caveWallVertexPositionBuffer4.itemSize=3;
    caveWallVertexPositionBuffer4.numItems=4; 
    
    caveWallVertexNormalBuffer4 =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  caveWallVertexNormalBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(caveWallNormals4), gl.STATIC_DRAW);
    caveWallVertexNormalBuffer4.itemSize=3;
    caveWallVertexNormalBuffer4.numItems= 4;
    
    caveWallVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveWallTexCoords),
		  gl.STATIC_DRAW);
    caveWallVertexTextureCoordBuffer.itemSize=2;
    caveWallVertexTextureCoordBuffer.numItems=4;
	
    caveWallVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveWallVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(caveWallIndices), gl.STATIC_DRAW);
    caveWallVertexIndexBuffer.itemSize=1;
    caveWallVertexIndexBuffer.numItems=6;
	
	//Create ceiling
	var caveCeilingVerts = [
		40, 40, 40,
		-40, 40, 40,
		-40, 40, -40,
		40, 40, -40];
		
	var caveCeilingNormals = [
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
	];    
	var caveCeilingTexCoords = [0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]; 
		
	var caveCeilingIndices = [0,1,2, 0,2,3];	
		
	caveCeilingVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveCeilingVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveCeilingVerts),gl.STATIC_DRAW);
    caveCeilingVertexPositionBuffer.itemSize=3;
    caveCeilingVertexPositionBuffer.numItems=4; 
    
    caveCeilingVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  caveCeilingVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(caveCeilingNormals), gl.STATIC_DRAW);
    caveCeilingVertexNormalBuffer.itemSize=3;
    caveCeilingVertexNormalBuffer.numItems= 4;
    
    caveCeilingVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, caveCeilingVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(caveCeilingTexCoords),
		  gl.STATIC_DRAW);
    caveCeilingVertexTextureCoordBuffer.itemSize=2;
    caveCeilingVertexTextureCoordBuffer.numItems=4;
	
    caveCeilingVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveCeilingVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(caveCeilingIndices), gl.STATIC_DRAW);
    caveCeilingVertexIndexBuffer.itemSize=1;
    caveCeilingVertexIndexBuffer.numItems=6;

}


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

    var mMatrix = mat4.create();  // model matrix
    var vMatrix = mat4.create(); // view matrix
    var pMatrix = mat4.create();  //projection matrix
    var nMatrix = mat4.create();  // normal matrix
    var v2wMatrix = mat4.create();  // eye space to world space matrix 
    var Z_angle = 0.0;
    var Y_angle = 0.0;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);	
        gl.uniformMatrix4fv(shaderProgram.v2wMatrixUniform, false, v2wMatrix);		
	
    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
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

///////////////////////////////////////////////////////////////

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    if (geodudeVertexPositionBuffer == null || geodudeVertexNormalBuffer == null || geodudeVertexIndexBuffer == null) {
            return;
        }
	
	pMatrix = mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

	vMatrix = mat4.lookAt([eyeMatrix[3],eyeMatrix[7],eyeMatrix[11]], [0,0,0], [0,1,0], vMatrix);	// set up the view matrix, multiply into the modelview matrix

	//Setting up other matrices
    mat4.identity(mMatrix);


    mMatrix = mat4.scale(mMatrix, [1/10, 1/10, 1/10]); 
	

	mat4.identity(nMatrix); 
	nMatrix = mat4.multiply(nMatrix, vMatrix);
	nMatrix = mat4.multiply(nMatrix, mMatrix); 	
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix); 
	
		//Setting up v2w matrix for environment cube mapping
	mat4.identity(v2wMatrix);
	v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
	v2wMatrix = mat4.transpose(v2wMatrix); 

	shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");

	gl.uniform4f(shaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
	gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
	gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 

	gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 

	PushMatrix(mMatrix);
	//Scale up the geodude because I made it too small in my modeling program.
	mMatrix = mat4.scale(mMatrix, [4, 4, 4]);
	// Create geodude
	gl.bindBuffer(gl.ARRAY_BUFFER, geodudeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geodudeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, geodudeVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, geodudeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, geodudeVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, geodudeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geodudeVertexIndexBuffer); 	

	setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
	gl.uniform1i(shaderProgram.use_textureUniform, 2); //this tells the program to do an environment cube map texture 
	   
	gl.activeTexture(gl.TEXTURE1); // set texture unit 1 to use
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture); 
	console.log(cubemapTexture);
	gl.uniform1i(shaderProgram.cube_map_textureUniform, 1); 


	//This draws the geodude without the cube map, comment it back in if you want to see it
        //gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use 
	//gl.bindTexture(gl.TEXTURE_2D, geodudeTexture);    // bind the texture object to the texture unit 
	//gl.uniform1i(shaderProgram.textureUniform, 0);   // pass the texture unit to the shader    

	gl.drawElements(gl.TRIANGLES, geodudeVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	
	
	mMatrix = PopMatrix();
	
	
	//Create ground
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, groundVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, groundVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, groundVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groundVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);   


	   
	gl.activeTexture(gl.TEXTURE4);   // set texture unit 4 to use 
	gl.bindTexture(gl.TEXTURE_2D, floorTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 4);   // pass the texture unit to the shader  

	gl.drawElements(gl.TRIANGLES, groundVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	
	
	
	// Create wall 1
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer1);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, caveWallVertexPositionBuffer1.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexNormalBuffer1);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, caveWallVertexNormalBuffer1.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, caveWallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveWallVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);     
	gl.activeTexture(gl.TEXTURE2);   // set texture unit 2 to use 
	gl.bindTexture(gl.TEXTURE_2D, caveWallTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 2);   // pass the texture unit to the shader  
	gl.drawElements(gl.TRIANGLES, caveWallVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
	
	
	//Create wall 2
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer2);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, caveWallVertexPositionBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexNormalBuffer2);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, caveWallVertexNormalBuffer2.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, caveWallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveWallVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);     
	gl.activeTexture(gl.TEXTURE5);   // set texture unit 5 to use 
	gl.bindTexture(gl.TEXTURE_2D, caveWallSwordsTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 5);   // pass the texture unit to the shader  
	gl.drawElements(gl.TRIANGLES, caveWallVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	
	
	
	//Create wall 3
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer3);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, caveWallVertexPositionBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexNormalBuffer3);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, caveWallVertexNormalBuffer3.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, caveWallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveWallVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);     
	gl.activeTexture(gl.TEXTURE6);   // set texture unit 6 to use 
	gl.bindTexture(gl.TEXTURE_2D, caveWallSignTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 6);   // pass the texture unit to the shader  
	gl.drawElements(gl.TRIANGLES, caveWallVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	
	
	
	//Create wall 4
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexPositionBuffer4);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, caveWallVertexPositionBuffer4.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexNormalBuffer4);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, caveWallVertexNormalBuffer4.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, caveWallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, caveWallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveWallVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);     
	gl.activeTexture(gl.TEXTURE7);   // set texture unit 7 to use 
	gl.bindTexture(gl.TEXTURE_2D, exitTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 7);   // pass the texture unit to the shader  
	gl.drawElements(gl.TRIANGLES, caveWallVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	
	
	
	//Create ceiling
	gl.bindBuffer(gl.ARRAY_BUFFER, caveCeilingVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, caveCeilingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, caveCeilingVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, caveCeilingVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, caveCeilingVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, caveCeilingVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, caveCeilingVertexIndexBuffer); 	
	
    setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);     
	gl.activeTexture(gl.TEXTURE3);   // set texture unit 3 to use 
	gl.bindTexture(gl.TEXTURE_2D, caveCeilingTexture);    // bind the texture object to the texture unit 
	gl.uniform1i(shaderProgram.textureUniform, 3);   // pass the texture unit to the shader  

	gl.drawElements(gl.TRIANGLES, caveCeilingVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);	

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

      }

     function onDocumentMouseMove( event ) {
          var mouseX = event.clientX;
          var mouseY = event.clientY; 

          var diffX = mouseX - lastMouseX;
          var diffY = mouseY - lastMouseY;
			console.log("X " + eyeMatrix[3] + " Y " + eyeMatrix[7] + " Z " + eyeMatrix[11]);
		  eyeMatrix = mat4.rotateY(eyeMatrix, degToRad(diffX/5)); 
			eyeMatrix = mat4.rotateX(eyeMatrix, degToRad(diffY/5)); 
			

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
        var canvas = document.getElementById("code12-canvas");
        initGL(canvas);
        initShaders();

		gl.enable(gl.DEPTH_TEST); 
		
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		
        shaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoords");
        gl.enableVertexAttribArray(shaderProgram.vertexTexCoordsAttribute);	
	
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
		shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");		

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
        shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	

		shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "myTexture");
		shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");
        shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");

		initJSON(); 	

		initTextures(); 
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        console.log('start! ');
        console.error('I hope no error ....');


		document.addEventListener('mousedown', onDocumentMouseDown,
		false); 

    }

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

function redraw() {
	eyeMatrix = [
			0, 0, 0, 1,
			0, 0, 0, 1,
			0, 0, 0, 1,
			0, 0, 0, 1];
    Z_angle = 0; 
    Y_angle = 0; 
    drawScene();
}
    

function geometry(type) {

    draw_type = type;
    drawScene();

} 
