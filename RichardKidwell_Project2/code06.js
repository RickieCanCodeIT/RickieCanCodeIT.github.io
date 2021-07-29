
    var gl;
    var shaderProgram;
    var draw_type=2;
	var which_object = 1; 

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


    // Declares buffers

    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    var squareBorderVertexColorBuffer;
    var lineVertexPositionBuffer; 
    var lineVertexColorBuffer;
    var circleVertexPositionBuffer;
    var circleVertexColorBuffer;
	var pointVertexPositionBuffer;
	var pointVertexColorBuffer;
    var triangleVertexPositionBuffer;
    var triangleVertexColorBuffer;
	var symbolVertexPositionBuffer;
	var symbolVertexColorBuffer;
	var symbolVertexIndexBuffer;

   ////////////////    Initialize VBO  ////////////////////////

    function initBuffers() {
		
		//Global Scaling factor
		GlobalScale = .15;
		//Square Vertex Position List
		s_vertices = [
			1,  1,  0.0,
			-1,  1,  0.0,
			-1, -1,  0.0, 
			1, -1,  0.0,
		];
		//Square Vertex Color List
        var s_colors = [
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
        ];
		//Triangle Vertex Position List
		
        t_vertices = [
             0,  1,  0.0,
	        -1, -1,  0.0, 
             1, -1,  0.0,
        ];
		
		//Triangle Vertex Color List
		t_colors = [
			0, 0, 1, 1,
			0, 0, 1, 1,
			0, 0, 1, 1
		];
			
		//OSU Symbol Vertex Position List
		symbol_vertices = [
			-.5, .6, 0,
			-.3, .8, 0,
			-.3, .6, 0,
			.3, .8, 0,
			.3, .6, 0,
			.5, .6, 0,
			.3, -.6, 0,
			.5, -.6, 0, 
			.3, -.8, 0,
			-.3, -.6, 0,
			-.3, -.8, 0,
			-.5, -.6, 0,
		];
			
		//OSU Symbol Vertex Index List	
		symbol_indices = [
			0, 1, 2,
			1, 2, 3,
			2, 3, 4,
			3, 4, 5,
			4, 5, 6,
			5, 6, 7,
			6, 7, 8,
			6, 8, 9,
			8, 9, 10,
			9, 10, 11,
			9, 11, 0,
			0, 2, 9
		];
			
		//OSU Symbol Vertex Color List
		symbol_colors = [
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1,
			.7, .7, .7, 1
		];
		
		//Border Vertex Color List
        var borderColors = [
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
        ];
			
		//Smiley Face Line Vertex Position and Color List
		l_vertices = [];
		l_colors = [];
		for (counter = 90; counter < 270; counter++)
		{
			l_vertices.push(Math.sin((counter * Math.PI) / 180.0) * 2 / 3);
			l_vertices.push(Math.cos((counter * Math.PI) / 180.0) * 2 / 3);
			l_vertices.push(0.0);
			l_colors.push(0.0);
			l_colors.push(0.0);
			l_colors.push(0.0);
			l_colors.push(1.0);
		}
		
		//Smiley Face Point Vertex Position List
		p_vertices = [-.3, .5, 0.0,
			.3, .5, 0.0];
		
		//Smiley Face Point Vertex Color List
		p_colors = [0.0, 0.0, 0.0, 1.0, 
			0.0, 0.0, 0.0, 1.0];
		
		//Circle Vertex Position List
		var c_vertices = [
		0.0, 0.0, 0.0];
		for (counter = 0; counter < 360; counter++)
		{
			c_vertices.push(Math.sin((counter * Math.PI) / 180.0));
			c_vertices.push(Math.cos((counter * Math.PI) / 180.0));
			c_vertices.push(0.0);
		}
		c_vertices.push(0.0);
		c_vertices.push(1.0);
		c_vertices.push(0.0);
		
		//Circle Vertex Color List
        var c_colors = [
		1.0, 1.0, 0.0, 1.0];
		
		for (counter = 0; counter < 360; counter++)
		{
			
			c_colors.push(1.0);
			c_colors.push(1.0);
			c_colors.push(0.0);
			c_colors.push(1.0);
			
		}
		c_colors.push(1.0);
		c_colors.push(1.0);
		c_colors.push(0.0);
		c_colors.push(1.0);
	
		//initialize Square Vertex Position Buffer
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(s_vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;
		
		//initialize Square Vertex Color Buffer
        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(s_colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 4;

		//initialize Square Border Vertex Color Buffer
        squareBorderVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareBorderVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(borderColors), gl.STATIC_DRAW);
        squareBorderVertexColorBuffer.itemSize = 4;
        squareBorderVertexColorBuffer.numItems = 4;
	
		//initialize Triangle Vertex Position Buffer
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(t_vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;

		//initialize Triangle Vertex Color Buffer
        triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(t_colors), gl.STATIC_DRAW);
        triangleVertexColorBuffer.itemSize = 4;
        triangleVertexColorBuffer.numItems = 3;

		//initialize Circle Vertex Position Buffer
		circleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c_vertices), gl.STATIC_DRAW);
        circleVertexPositionBuffer.itemSize = 3;
        circleVertexPositionBuffer.numItems = 362;
		
		//initialize Circle Vertex Color Buffer
		circleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c_colors), gl.STATIC_DRAW);
        circleVertexColorBuffer.itemSize = 4;
        circleVertexColorBuffer.numItems = 362;
		
	
		//initialize Smiley Face Point Vertex Position Buffer
        pointVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p_vertices), gl.STATIC_DRAW);
        pointVertexPositionBuffer.itemSize = 3;
        pointVertexPositionBuffer.numItems = 2;
		
		//initialize Smiley Face Point Vertex Color Buffer
        pointVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p_colors), gl.STATIC_DRAW);
        pointVertexColorBuffer.itemSize = 4;
        pointVertexColorBuffer.numItems = 2;

		//initialize Smiley Face Line Vertex Position Buffer
		lineVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l_vertices), gl.STATIC_DRAW);
        lineVertexPositionBuffer.itemSize = 3;
        lineVertexPositionBuffer.numItems = l_vertices.length / 3;
		
		//initialize Smiley Face Line Vertex Color Buffer
        lineVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l_colors), gl.STATIC_DRAW);
        lineVertexColorBuffer.itemSize = 4;
        lineVertexColorBuffer.numItems = l_colors.length / 4;
		
		//initialize OSU Symbol Vertex Position Buffer
        symbolVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, symbolVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(symbol_vertices), gl.STATIC_DRAW);
        symbolVertexPositionBuffer.itemSize = 3;
        symbolVertexPositionBuffer.numItems = 12;

		//initialize OSU Symbol Vertex Color Buffer
        symbolVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, symbolVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(symbol_colors), gl.STATIC_DRAW);
        symbolVertexColorBuffer.itemSize = 4;
        symbolVertexColorBuffer.numItems = 12;

		//initialize OSU Symbol Vertex Index Buffer
		symbolVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, symbolVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(symbol_indices), gl.STATIC_DRAW);  
        symbolVertexIndexBuffer.itemSize = 1;
        symbolVertexIndexBuffer.numItems = 36; 

    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

	// mv Matrix Definitions
	var mvMatrix1, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7; 
	var mvMatrixArms1, mvMatrixArms2, mvMatrixArms3;
	var mvTriangleMatrix1, mvTriangleMatrix2, mvTriangleMatrix3, mvTriangleMatrix4, mvTriangleMatrix5, mvTriangleMatrix6;
	var GlobalScale;
    
    var Xtranslate = 0.0, Ytranslate = 0.0; 
	//sets matrix uniforms
    function setMatrixUniforms(matrix) {
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
    }

	//translates degrees to radians
     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }

///////////////////////////////////////////////////////

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



	//Draws a square using the matrix
    function draw_square(matrix, isBorder) {

        setMatrixUniforms(matrix);	
	
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		//Use different colors depending on the type of square being drawn
		if (isBorder) {
			//binds Vertex Color Buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, squareBorderVertexColorBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareBorderVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		
		} else {
			//binds Vertex Color Buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		}
		gl.drawArrays(gl.TRIANGLE_FAN, 0, squareVertexPositionBuffer.numItems);
    }

	//Draws a triangle using the matrix
    function draw_triangle(matrix) {

        setMatrixUniforms(matrix);	

		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		//binds Vertex Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,triangleVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, triangleVertexPositionBuffer.numItems);
    }
	
	//Draws an OSU symbol using the matrix
	function draw_symbol(matrix) {
	
        setMatrixUniforms(matrix);	
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, symbolVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, symbolVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//binds Vertex Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, symbolVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, symbolVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// binds vertex index buffer and draws triangles 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, symbolVertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	}

	//Draws a circle using the matrix
    function draw_circle(matrix) {

        setMatrixUniforms(matrix);	
		
		//binds Circle Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		//binds Circle Vertex Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,circleVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVertexPositionBuffer.numItems);
		
		//binds Smiley Face Line Vertex Position Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lineVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		//binds Smiley Face Line Vertex Color Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,lineVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		gl.drawArrays(gl.LINE_STRIP, 0, lineVertexPositionBuffer.numItems);
	
		//binds Smiley Face Point Vertex Position Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pointVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		//binds Smiley Face Point Vertex Color Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,pointVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
		gl.drawArrays(gl.POINTS, 0, pointVertexPositionBuffer.numItems);


    }



///////////////////////////////////////////////////////////////////////

    function drawScene() {

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var Mstack = new Array(); 
        var model = mat4.create(); 
		mat4.identity(model);
		model = mat4.scale(model, [GlobalScale, GlobalScale, GlobalScale]); // make the whole thing smaller
	
		makeDecorations();

		//  Draws Main Body
	
        model = mat4.multiply(model, mvMatrix1); 
		PushMatrix(model);
        model = mat4.multiply(model, mvMatrixArms1); 
		draw_square(model, false);
		model = PopMatrix();
		draw_circle(model);
		PushMatrix(model);
	
		// Triangle branch 1
	
		model = mat4.multiply(model, mvTriangleMatrix1); 
		draw_triangle(model);	
	
		model = mat4.multiply(model, mvTriangleMatrix2);
		draw_triangle(model);	
	
		model = mat4.multiply(model, mvTriangleMatrix3);
		draw_triangle(model);	
	
		//Triangle branch 2
		model = PopMatrix();
		PushMatrix(model); 
	
		model = mat4.multiply(model, mvTriangleMatrix4); 
		draw_triangle(model);	
	
		model = mat4.multiply(model, mvTriangleMatrix5);
		draw_triangle(model);	
	
		model = mat4.multiply(model, mvTriangleMatrix6);
		draw_triangle(model);	
	
	
		model = PopMatrix();
		PushMatrix(model);


		//   Circle Arm branch 1
        model = mat4.multiply(model, mvMatrix2); 
		PushMatrix(model);

        model = mat4.multiply(model, mvMatrixArms2); 
		draw_square(model, false);
		model = PopMatrix();
		draw_circle(model);
		PushMatrix(model);

	
        model = mat4.multiply(model, mvMatrix3); 
		draw_circle(model);
		model = PopMatrix();
	
		model = mat4.multiply(model, mvMatrix4); 
		draw_circle(model);
		//   Circle Arm branch 2
		model = PopMatrix();
		PushMatrix(model); 
		model = mat4.multiply(model, mvMatrix5); 
		PushMatrix(model); 
	
        model = mat4.multiply(model, mvMatrixArms3); 
		draw_square(model, false);

		model = PopMatrix();
		draw_circle(model);
	

		PushMatrix(model); 
	
		model = mat4.multiply(model, mvMatrix6); 
		draw_circle(model);	
		model = PopMatrix();
	
		model = mat4.multiply(model, mvMatrix7); 
		draw_circle(model);	
    }
	
	function makeDecorations() {
		//   Draws top border
		var topBorder = mat4.create(); 
        mat4.identity(topBorder);
		topBorder = mat4.scale(topBorder, [1, .1, 1]);
		topBorder = mat4.translate(topBorder, [0, 9, 0]);
		draw_square(topBorder, true);
			  
		//   Draws bottom border
		var bottomBorder = mat4.create(); 
        mat4.identity(bottomBorder);
		bottomBorder = mat4.scale(bottomBorder, [1, .1, 1]);
		bottomBorder = mat4.translate(bottomBorder, [0, -9, 0]);
		draw_square(bottomBorder, true);
			 
		//   Draws left border 
		var LeftBorder = mat4.create(); 
        mat4.identity(LeftBorder);
		LeftBorder = mat4.scale(LeftBorder, [.1, .8, 1]);
		LeftBorder = mat4.translate(LeftBorder, [-9, 0, 0]);
		draw_square(LeftBorder, true);
			  
		//   Draws right border
		var RightBorder = mat4.create(); 
        mat4.identity(RightBorder);
		RightBorder = mat4.scale(RightBorder, [.1, .8, 1]);
		RightBorder = mat4.translate(RightBorder, [9, 0, 0]);
		draw_square(RightBorder, true);
		
		//   Draws center OSU Symbol
		var centerSymbol = mat4.create(); 
        mat4.identity(centerSymbol);
		draw_symbol(centerSymbol);
		
		
	}


    ///////////////////////////////////////////////////////////////

    var lastMouseX = 0, lastMouseY = 0;


    ///////////////////////////////////////////////////////////////
	// Set up mouse down
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
	
	// Set up Mouse move
     function onDocumentMouseMove( event ) {
        var mouseX = event.clientX;
        var mouseY = event.ClientY; 

        var diffX = mouseX - lastMouseX;
        var diffY = mouseY - lastMouseY;

		if (which_object == 1) 
			// Rotate Main Circle
			mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(diffX/5.0), [0, 0, 1]);
		if (which_object == 2)  {
			// Rotate Second Level Circles
			mvMatrix2 = mat4.rotate(mvMatrix2, degToRad(diffX/5.0), [0, 0, 1]);
			mvMatrix5 = mat4.rotate(mvMatrix5, degToRad(-1*diffX/5.0), [0, 0, 1]);	     
		}
		if (which_object == 3)  {
			// Rotate Third Level Circles
			mvMatrix3 = mat4.rotate(mvMatrix3, degToRad(diffX/5.0), [0, 0, 1]);
			mvMatrix4 = mat4.rotate(mvMatrix4, -1*degToRad(diffX/5.0), [0, 0, 1]);
			mvMatrix6 = mat4.rotate(mvMatrix6, degToRad(diffX/5.0), [0, 0, 1]);	 
			mvMatrix7 = mat4.rotate(mvMatrix7, -1*degToRad(diffX/5.0), [0, 0, 1]);	     
		}
		if (which_object == 4) {
			// Rotate First Level Triangles
			mvTriangleMatrix1 = mat4.rotate(mvTriangleMatrix1, degToRad(diffX/5.0), [0, 0, 1]);
			mvTriangleMatrix4 = mat4.rotate(mvTriangleMatrix4, -1*degToRad(diffX/5.0), [0, 0, 1]);
		}
		if (which_object == 5)  {
			// Rotate Second Level Triangles
			mvTriangleMatrix2 = mat4.rotate(mvTriangleMatrix2, degToRad(diffX/5.0), [0, 0, 1]);
			mvTriangleMatrix5 = mat4.rotate(mvTriangleMatrix5, -1*degToRad(diffX/5.0), [0, 0, 1]); 
		}
		if (which_object == 6)  {
			// Rotate Third Level Triangles
			mvTriangleMatrix3 = mat4.rotate(mvTriangleMatrix3, degToRad(diffX/5.0), [0, 0, 1]);
			mvTriangleMatrix6 = mat4.rotate(mvTriangleMatrix6, -1*degToRad(diffX/5.0), [0, 0, 1]);	     
		}
	 
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        drawScene();
     }
	// Set up mouse up
    function onDocumentMouseUp( event ) {
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

	// Set up mouse out
    function onDocumentMouseOut( event ) {
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }


	// Set up on key down
    function onKeyDown(event) {

      console.log(event.keyCode);
      switch(event.keyCode)  {
		 case 70:
			//f translates forward
			console.log('enter f');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, 1, 0]);	
		 break;
		 case 66:
			//b translates backwards
			console.log('enter b');
			mvMatrix1 = mat4.translate(mvMatrix1, [0, -1, 0]);	
		 break;
		 case 82:
			//r translates right
			console.log('enter r');
			mvMatrix1 = mat4.translate(mvMatrix1, [1, 0, 0]);	
		 break;
		 case 76:
			//l translates left
			console.log('enter l');
			mvMatrix1 = mat4.translate(mvMatrix1, [-1, 0, 0]);	
		 break;
		 case 83:
			//s increases global scale
			console.log('enter s');
			if (GlobalScale > .1) {
				GlobalScale -= .025;
			}
		 break;
		 case 87:
			//w decreases global scale
			console.log('enter w');
			if (GlobalScale < 1) {
				GlobalScale += .025;
			}
		 break;
         case 81:
              
			//q translates circles/triangles outwards
			console.log('enter q');
			if (which_object == 1)
				//translate main circle
				mvMatrix1 = mat4.translate(mvMatrix1, [-0.1, 0, 0]);		  		      
			if (which_object == 2) {
			
				//translates Second level circles and scales first arm
				mvMatrix2 = doRelativeTranslation(mvMatrix2, -.1, 0);
				mvMatrix5 = doRelativeTranslation(mvMatrix5, .1, 0);
			  
				mvMatrixArms1[0] += .1;	
			}
			if (which_object == 3) {
				//translates Third level circles and scales second and third arm
				mvMatrix3 = doRelativeTranslation(mvMatrix3, -.1, 0);
				mvMatrix4 = doRelativeTranslation(mvMatrix4, .1, 0);
				mvMatrix6 = doRelativeTranslation(mvMatrix6, -.1, 0);
				mvMatrix7 = doRelativeTranslation(mvMatrix7, .1, 0);	
				mvMatrixArms2[0] += .1;
				mvMatrixArms3[0] += .1;
			}		  		      
			if (which_object == 4) {
			
				//translates First level triangles
				mvTriangleMatrix1 = doRelativeTranslation(mvTriangleMatrix1, 0, -.1);
				mvTriangleMatrix4 = doRelativeTranslation(mvTriangleMatrix4, 0, .1);
			}		      
			if (which_object == 5) {
			
				//translates Second level triangles
				mvTriangleMatrix2 = doRelativeTranslation(mvTriangleMatrix2, 0, -.1);
				mvTriangleMatrix5 = doRelativeTranslation(mvTriangleMatrix5, 0, -.1);
			}    
			if (which_object == 6) {
			
				//translates Third level triangles
				mvTriangleMatrix3 = doRelativeTranslation(mvTriangleMatrix3, 0, -.1);
				mvTriangleMatrix6 = doRelativeTranslation(mvTriangleMatrix6, 0, -.1);
			  
			}
              
         break;
         case 65:
          
			//a translates circles/triangles inwards
			console.log('enter a');
			if (which_object == 1)
				//translate main circle
				mvMatrix1 = mat4.translate(mvMatrix1, [0.1, 0, 0]);		  		      
			if (which_object == 2) {
			
				//translates Second level circles and scales first arm
				mvMatrix2 = doRelativeTranslation(mvMatrix2, .1, 0);
				mvMatrix5 = doRelativeTranslation(mvMatrix5, -.1, 0);
			  
				mvMatrixArms1[0] -= .1;	
			  
			  
			}
			if (which_object == 3) {
				//translates Third level circles and scales second and third arm
				mvMatrix3 = doRelativeTranslation(mvMatrix3, .1, 0);
				mvMatrix4 = doRelativeTranslation(mvMatrix4, -.1, 0);
				mvMatrix6 = doRelativeTranslation(mvMatrix6, .1, 0);
				mvMatrix7 = doRelativeTranslation(mvMatrix7, -.1, 0);	
				mvMatrixArms2[0] -= .1;
				mvMatrixArms3[0] -= .1;
			}		      
			if (which_object == 4) {
			
				//translates First level triangles
				mvTriangleMatrix1 = doRelativeTranslation(mvTriangleMatrix1, 0, .1);
				mvTriangleMatrix4 = doRelativeTranslation(mvTriangleMatrix4, 0, -.1);
			}		      
			if (which_object == 5) {
			
				//translates Second level triangles
				console.log(mat4.str(mvTriangleMatrix2));
				console.log(mat4.str(mvTriangleMatrix5));
				mvTriangleMatrix2 = doRelativeTranslation(mvTriangleMatrix2, 0, .1);
				mvTriangleMatrix5 = doRelativeTranslation(mvTriangleMatrix5, 0, .1);
				console.log(mat4.str(mvTriangleMatrix2));
				console.log(mat4.str(mvTriangleMatrix5));
			  
			}    
			if (which_object == 6) {
			
				//translates Third level triangles
				mvTriangleMatrix3 = doRelativeTranslation(mvTriangleMatrix3, 0, .1);
				mvTriangleMatrix6 = doRelativeTranslation(mvTriangleMatrix6, 0, .1);
			  
			}
              
         break;
		 case 69:
              //e scales triangles up
			console.log('enter e');	 
			if (which_object == 4) {
			
				//scales First level triangles
				mvTriangleMatrix1 = mat4.scale(mvTriangleMatrix1, [1.1, 1.1, 1]);
				mvTriangleMatrix4 = mat4.scale(mvTriangleMatrix4, [1.1, 1.1, 1]);
			}		      
			if (which_object == 5) {
			
				//scales Second level triangles
				mvTriangleMatrix2 = mat4.scale(mvTriangleMatrix2, [1.1, 1.1, 1]);
				mvTriangleMatrix5 = mat4.scale(mvTriangleMatrix5, [1.1, 1.1, 1]);
			  
			}    
			if (which_object == 6) {
			
				//scales Third level triangles
				mvTriangleMatrix3 = mat4.scale(mvTriangleMatrix3, [1.1, 1.1, 1]);
				mvTriangleMatrix6 = mat4.scale(mvTriangleMatrix6, [1.1, 1.1, 1]);
			  
			}
              
         break;
		 case 68:
              //d scales triangles down
              
			console.log('enter d');	     
			if (which_object == 4) {
			
				//scales First level triangles
				mvTriangleMatrix1 = mat4.scale(mvTriangleMatrix1, [.9, .9, 1]);
				mvTriangleMatrix4 = mat4.scale(mvTriangleMatrix4, [.9, .9, 1]);
			}		      
			if (which_object == 5) {
			
				//scales Second level triangles
				mvTriangleMatrix2 = mat4.scale(mvTriangleMatrix2, [.9, .9, 1]);
				mvTriangleMatrix5 = mat4.scale(mvTriangleMatrix5, [.9, .9, 1]);
			  
			}    
			if (which_object == 6) {
			
				//scales Third level triangles
				mvTriangleMatrix3 = mat4.scale(mvTriangleMatrix3, [.9, .9, 1]);
				mvTriangleMatrix6 = mat4.scale(mvTriangleMatrix6, [.9, .9, 1]);
			  
			}
              
         break;
       }
       drawScene();
    }
    ///////////////////////////////////////////////////////////////
	
	//translates matrixes relative to their parent
	function doRelativeTranslation(inMat, XShift, YShift) {
		//Get rotation matrix
		var RotationMatrix = mat4.toRotationMat(inMat);
		// Gets scale for use on the rotation angle
		var XScale = Math.sqrt(inMat[0] * inMat[0] + inMat[4] * inMat[4]);
		var YScale = Math.sqrt(inMat[1] * inMat[1] + inMat[5] * inMat[5]);
		var RotAngle = Math.asin(RotationMatrix[4] / XScale);
		console.log ("XScale " + XScale + " YScale " + YScale + "Rot Angle " + RotAngle + " Matrix " + mat4.str(RotationMatrix));
		//Account for sign
		if (RotationMatrix[0] < 0)
			RotAngle = Math.PI - RotAngle;
			//Rotates matrix to original orientation, translates, then rotates back
		inMat = mat4.rotate(inMat, RotAngle, [0, 0, 1]);
	    inMat = mat4.translate(inMat, [XShift, YShift, 0]);
		inMat = mat4.rotate(inMat, -RotAngle, [0, 0, 1]);
		return inMat;
	}

    function webGLStart() {
		//get canvas element
        var canvas = document.getElementById("code04-canvas");
		
		//initializes canvasses and shaders
        initGL(canvas);
        initShaders();
		
		//links aVertexPosition
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		//links aVertexColor
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		//links uMVMatrix
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.whatever = 4;
		shaderProgram.whatever2 = 3; 

        initBuffers(); 
		//sets clear color
        gl.clearColor(0.6, 0.6, 0.6, 1.0);

		document.addEventListener('mousedown', onDocumentMouseDown,false);
		document.addEventListener('keydown', onKeyDown, false);

		//create matrixes
		mvMatrix1 = mat4.create(); 
		mat4.identity(mvMatrix1);

		mvMatrix2 = mat4.create(); 
        mat4.identity(mvMatrix2);

		mvMatrix3 = mat4.create(); 
        mat4.identity(mvMatrix3);

		mvMatrix4 = mat4.create(); 
        mat4.identity(mvMatrix4);

		mvMatrix5 = mat4.create(); 
        mat4.identity(mvMatrix5);
		mvMatrix6 = mat4.create(); 
        mat4.identity(mvMatrix6);
		mvMatrix7 = mat4.create(); 
        mat4.identity(mvMatrix7);	

		mvTriangleMatrix1 = mat4.create(); 
        mat4.identity(mvTriangleMatrix1);

		mvTriangleMatrix2 = mat4.create(); 
        mat4.identity(mvTriangleMatrix2);

		mvTriangleMatrix3 = mat4.create(); 
        mat4.identity(mvTriangleMatrix3);

		mvTriangleMatrix4 = mat4.create(); 
        mat4.identity(mvTriangleMatrix4);
		mvTriangleMatrix5 = mat4.create(); 
        mat4.identity(mvTriangleMatrix5);
		mvTriangleMatrix6 = mat4.create(); 
        mat4.identity(mvTriangleMatrix6);	

		mvMatrixArms1 = mat4.create(); 
        mat4.identity(mvMatrixArms1);

		mvMatrixArms2 = mat4.create(); 
        mat4.identity(mvMatrixArms2);

		mvMatrixArms3 = mat4.create(); 
        mat4.identity(mvMatrixArms3);
		
		//Modify matrixes where needed
	    mvTriangleMatrix4 = mat4.rotate(mvTriangleMatrix4, Math.PI, [0, 0, 1]);
	
		mvMatrixArms1 = mat4.scale(mvMatrixArms1, [.1, .5, 1]);
		mvMatrixArms2 = mat4.scale(mvMatrixArms2, [.1, .5, 1]);	
		mvMatrixArms3 = mat4.scale(mvMatrixArms3, [.1, .5, 1]);
		
		setup_matrices();
        drawScene();
    }
	
	function setup_matrices() {	  		
		//Translates Second level circles, scales First arm, and rotates matrix
		mvMatrix2 = doRelativeTranslation(mvMatrix2, -3, 0);
		mvMatrix5 = doRelativeTranslation(mvMatrix5, 3, 0);
			  
		mvMatrixArms1[0] += 3;	
			  
	    mvMatrix2 = mat4.rotate(mvMatrix2, Math.PI / 2, [0, 0, 1]);
	    mvMatrix5 = mat4.rotate(mvMatrix5, -Math.PI / 2, [0, 0, 1]);	 
		//Translates Third level circles, scales second and third arm
		mvMatrix3 = doRelativeTranslation(mvMatrix3, -3, 0);
		mvMatrix4 = doRelativeTranslation(mvMatrix4, 3, 0);
		mvMatrix6 = doRelativeTranslation(mvMatrix6, -3, 0);
		mvMatrix7 = doRelativeTranslation(mvMatrix7, 3, 0);	
		mvMatrixArms2[0] += 3;
		mvMatrixArms3[0] += 3;
			  
		//Translates First level triangles
		mvTriangleMatrix1 = doRelativeTranslation(mvTriangleMatrix1, 0, -1.5);
		mvTriangleMatrix4 = doRelativeTranslation(mvTriangleMatrix4, 0, 1.5);
			  
		//Translates Second level triangles
		mvTriangleMatrix2 = doRelativeTranslation(mvTriangleMatrix2, 0, -1.5);
		mvTriangleMatrix5 = doRelativeTranslation(mvTriangleMatrix5, 0, -1.5);
			
		//Translates Third level triangles
		mvTriangleMatrix3 = doRelativeTranslation(mvTriangleMatrix3, 0, -1.5);
		mvTriangleMatrix6 = doRelativeTranslation(mvTriangleMatrix6, 0, -1.5);
			  
		  
	}

	function BG(red, green, blue) {

		gl.clearColor(red, green, blue, 1.0);
		drawScene(); 

	} 

	function redraw() {
		// reset matrices
		mat4.identity(mvMatrix1);
		mat4.identity(mvMatrix2);
		mat4.identity(mvMatrix3);
		mat4.identity(mvMatrix4);
		mat4.identity(mvMatrix5);  
		mat4.identity(mvMatrix6);
		mat4.identity(mvMatrix7); 
		mat4.identity(mvTriangleMatrix1);
		mat4.identity(mvTriangleMatrix2);
		mat4.identity(mvTriangleMatrix3);
		mat4.identity(mvTriangleMatrix4);
		mat4.identity(mvTriangleMatrix5);  
		mat4.identity(mvTriangleMatrix6);  
		mat4.identity(mvMatrixArms1);
		mat4.identity(mvMatrixArms2);
		mat4.identity(mvMatrixArms3);
		
		// modify matrixes where needed
	    mvTriangleMatrix4 = mat4.rotate(mvTriangleMatrix4, Math.PI, [0, 0, 1]);
		mvMatrixArms1 = mat4.scale(mvMatrixArms1, [.1, .5, 1]);
		mvMatrixArms2 = mat4.scale(mvMatrixArms2, [.1, .5, 1]);	
		mvMatrixArms3 = mat4.scale(mvMatrixArms3, [.1, .5, 1]);  
		setup_matrices();
		drawScene();
	}

	function obj(object_id) {
		//sets which object to manipulate
		which_object = object_id;
		drawScene();

	} 
