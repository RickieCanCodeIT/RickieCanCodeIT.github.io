
    var gl;
	var glText;
    var shaderProgram;
    var draw_type=2;

//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas, textCanvas) {
        try {
			// gets gl Context
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
			// Get text canvas context
			glText = textCanvas.getContext("2d");
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    var squareVertexIndexBuffer;
	
	var AxesPositionBuffer;
	var AxesColorBuffer;
	
	// Arrays for the 2 types of Axes the program requires
	var Axes = [
	.9, -.9, 0.0,
	-.9, -.9, 0.0,
	-.9, -.9, 0.0,
	-.9, .9, 0.0,
	-.9, .9, 0.0,
	.9, .9, 0.0,
	-.9, .45, 0.0,
	.9, .45, 0.0,
	-.9, 0.0, 0.0,
	.9, 0.0, 0.0,
	-.9, -.45, 0.0,
	.9, -.45, 0.0,
	-.9, -.9, 0.0,
	-.9, -.9, 0.0,
	-.6, -.95, 0.0,
	-.6, -.9, 0.0,
	0.0, -.95, 0.0,
	0.0, -.9, 0.0,
	.6, -.95, 0.0,
	.6, -.9, 0.0
	];
	
	var AxesColors = [
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0];
	
	var SingleAxes = [
	.9, -.9, 0.0,
	-.9, -.9, 0.0,
	-.9, -.9, 0.0,
	-.9, .9, 0.0,
	-.9, .9, 0.0,
	.9, .9, 0.0,
	-.9, .45, 0.0,
	.9, .45, 0.0,
	-.9, 0.0, 0.0,
	.9, 0.0, 0.0,
	-.9, -.45, 0.0,
	.9, -.45, 0.0,
	-.9, -.9, 0.0,
	-.9, -.9, 0.0
	];
	
	var SingleAxesColors = [
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 0.0, 1.0];
	// graphMode keeps track of the type of graph
	var graphMode = "All";
	
	var setosaAvgs = [];
	var versicolorAvgs = [];
	var virginicaAvgs = [];

    var vertices = [];
    var colors = []; 
    var indices = [];
    var num_vertices; 
    var num_indices;
	
	var max = 0;

	//Displays the "All" graph
    function createAllGraphs(inSetosaAvgs, inVersicolorAvgs, inVirginicaAvgs) {
		// resetting data
		num_vertices = 0;
		num_indices = 0;
		vertices = [];
		colors = []; 
		indices = [];
		setosaAvgs = inSetosaAvgs;
		versicolorAvgs = inVersicolorAvgs;
		virginicaAvgs = inVirginicaAvgs;
		graphMode = "All";
		
		//finding max value and drawing graphs/legend
		findMax(0);
		makeBarGroup(setosaAvgs, "Setosa", -.82, -.9, .45, 1.8, 0);
		makeBarGroup(versicolorAvgs, "Versicolor", -.22, -.9, .45, 1.8, 1);
		makeBarGroup(virginicaAvgs, "Virginica", .38, -.9, .45, 1.8, 2);
		makeLegend(-.9, .92, 1.8, .06);
		
		//Initializing buffer and drawing scene
        initBuffers(); 

        drawScene();

	
    } 

	//displays specific graphs
    function createSpecificGraph(inType, inSetosaAvgs, inVersicolorAvgs, inVirginicaAvgs) {
	// resetting data
		num_vertices = 0;
		num_indices = 0;
		vertices = [];
		colors = []; 
		indices = [];
		setosaAvgs = inSetosaAvgs;
		versicolorAvgs = inVersicolorAvgs;
		virginicaAvgs = inVirginicaAvgs;
		graphMode = inType;
		
		//finding max value and drawing graphs/legend
		findMax(inType == "Setosa" ? 1 : (inType == "Versicolor" ? 2 : 3));
		makeBarGroup(inType == "Setosa" ? setosaAvgs : (inType == "Versicolor" ? versicolorAvgs : virginicaAvgs), inType, -.9, -.9, 1.8, 1.8, 0);
		
		//Initializing buffer and drawing scene
		initBuffers(); 

        drawScene();

	
    } 
	
	//makes a bargraph in a specific location and size
	function makeBarGroup(avgs, name, hMargin, vMargin, Width, Height, currentIndex) {
		//adding number of new vertices and indices
		var num_bars = avgs.length;
		num_vertices += num_bars * 4;
		num_indices += num_bars * 6;

		
		for (var i =0; i<num_bars; i++) {
		//pushing vertex coordinates
		var LowerX = hMargin + (Width / (num_bars - 1)) * i;
		var LowerY = vMargin;
		var HigherX = hMargin + (Width / (num_bars - 1)) * (i+1);
		var HigherY = vMargin + Height*(avgs[i])/max;
		console.log(LowerX + " LowerX, " + LowerY + " LowerY, " + HigherX + " HigherX, " + HigherY + " HigherY");
        vertices.push(LowerX); vertices.push(LowerY); vertices.push(0.0);
	    vertices.push(HigherX); vertices.push(LowerY); vertices.push(0.0);
	    vertices.push(HigherX); vertices.push(HigherY); vertices.push(0.0);
	    vertices.push(LowerX); vertices.push(HigherY); vertices.push(0.0);
	    
		//determining color
		var Red = 0.0;
		var Green = 0.0;
		var Blue = 0.0;
		var Alpha = 1.0;
		if (i % 4 == 0)
		{
			Red = 1.0;
		}
		else if (i % 4 == 1)
		{
			Green = 1.0;
		}
		else if (i % 4 == 2)
		{
			Blue = 1.0;
		}
		else
		{
			Green = 1.0;
			Red = 1.0;
		}
		// modifying colors based on graphMode
		if (graphMode == "Setosa") {
			Red = (Red + 1.0) / 2; 
		}
		else if (graphMode == "Versicolor") {
			Green = (Green + 1.0) / 2; 
		}
		else if (graphMode == "Virginica") {
			Blue = (Blue + 1.0) / 2; 
		}
		
		//adding indices for triangles
	    indices.push(0+4*i + 4*num_bars*currentIndex);  indices.push(1+4*i + 4*num_bars*currentIndex);  indices.push(2+4*i + 4*num_bars*currentIndex);
	    indices.push(0+4*i + 4*num_bars*currentIndex);  indices.push(2+4*i + 4*num_bars*currentIndex);  indices.push(3+4*i + 4*num_bars*currentIndex); 
		
		console.log((0+4*i + 4*num_bars*currentIndex) + " and " + (1+4*i + 4*num_bars*currentIndex) + " and " + (2+4*i + 4*num_bars*currentIndex));
		console.log((0+4*i + 4*num_bars*currentIndex) + " and " + (2+4*i + 4*num_bars*currentIndex) + " and " + (3+4*i + 4*num_bars*currentIndex));
		
		//adding color data
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha);     
	}
	}
	
	//makes a legend
	function makeLegend(hMargin, vMargin, Width, Height) {
		//getting starting number of vertices and adding number of vertices/indices
		var startVerts = num_vertices;
		num_vertices += 16;
		num_indices += 24;
		
		for (var i =0; i<4; i++) {
		//pushing vertex coordinates
		var LowerX = hMargin + (Width / 4) * i;
		var LowerY = vMargin;
		var HigherX = hMargin + (Width / 4) * i + Height
		var HigherY = vMargin + Height
        vertices.push(LowerX); vertices.push(LowerY); vertices.push(0.0);
	    vertices.push(HigherX); vertices.push(LowerY); vertices.push(0.0);
	    vertices.push(HigherX); vertices.push(HigherY); vertices.push(0.0);
	    vertices.push(LowerX); vertices.push(HigherY); vertices.push(0.0);
		
		//determining color
		var Red = 0.0;
		var Green = 0.0;
		var Blue = 0.0;
		var Alpha = 1.0;
		if (i % 4 == 0)
		{
			Red = 1.0;
		}
		else if (i % 4 == 1)
		{
			Green = 1.0;
		}
		else if (i % 4 == 2)
		{
			Blue = 1.0;
		}
		else
		{
			Green = 1.0;
			Red = 1.0;
		}
		
		//adding indices for triangles
	    indices.push(0+4*i + startVerts);  indices.push(1+4*i + startVerts);  indices.push(2+4*i + startVerts);
	    indices.push(0+4*i + startVerts);  indices.push(2+4*i + startVerts);  indices.push(3+4*i + startVerts); 
		console.log((0+4*i + startVerts) + " and " + (1+4*i + startVerts) + " and " + (2+4*i + startVerts));
		console.log((0+4*i + startVerts) + " and " + (2+4*i + startVerts) + " and " + (3+4*i + startVerts));
		
		//adding color data
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha); 
		colors.push(Red); colors.push(Green); colors.push(Blue); colors.push(Alpha);     
		
		}
	}
	
	//finds the max of the graph data
	function findMax(searchType) {
		if (searchType == 0) {
			// Search Type 0 searches through all averages for the max
			max = setosaAvgs[0];
			for (var i=0; i<setosaAvgs.length; i++) {
				if (Number(setosaAvgs[i]) > max) max = Number(setosaAvgs[i]); 
			} 
		
			for (var i=0; i<versicolorAvgs.length; i++) {
				if (Number(versicolorAvgs[i]) > max) max = Number(versicolorAvgs[i]); 
			} 
		
			for (var i=0; i<virginicaAvgs.length; i++) {
				if (Number(virginicaAvgs[i]) > max) max = Number(virginicaAvgs[i]); 
			} 
		}
		else if (searchType == 1) {
			// Search Type 1 searches setosa averages for the max
			max = setosaAvgs[0];
			for (var i=0; i<setosaAvgs.length; i++) {
				if (Number(setosaAvgs[i]) > max) max = Number(setosaAvgs[i]); 
			} 
		}
		else if (searchType == 2) {
			// Search Type 2 searches versicolor averages for the max
			max = versicolorAvgs[0];
			for (var i=0; i<versicolorAvgs.length; i++) {
				if (Number(versicolorAvgs[i]) > max) max = Number(versicolorAvgs[i]); 
			} 
		}
		else if (searchType == 3) {
			// Search Type 3 searches virginica averages for the max
			max = virginicaAvgs[0];
			for (var i=0; i<virginicaAvgs.length; i++) {
				if (Number(virginicaAvgs[i]) > max) max = Number(virginicaAvgs[i]); 
			} 
		}
	}

   // Initializes VBO

    function initBuffers() {
	
		//initialize Vertex Position Buffer
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = num_vertices;

		//initialize Vertex Index Buffer
	squareVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
        squareVertexIndexBuffer.itemSize = 1;
        squareVertexIndexBuffer.numItems = num_indices; 

		//initialize Vertex Color Buffer
	squareVertexColorBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);  
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = num_vertices; 
		
		//initialize Axes Position Buffer
		AxesPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, AxesPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graphMode == "All" ? Axes : SingleAxes), gl.STATIC_DRAW);
        AxesPositionBuffer.itemSize = 3;
        AxesPositionBuffer.numItems = graphMode == "All" ? Axes.length / 3 : SingleAxes.length / 3;
		
		//initialize Axes Color Buffer
		AxesColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, AxesColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graphMode == "All" ? AxesColors : SingleAxesColors), gl.STATIC_DRAW);
        AxesColorBuffer.itemSize = 4;
        AxesColorBuffer.numItems = graphMode == "All" ? AxesColors.length / 4 : SingleAxesColors.length / 4;
    }


	//Draws the scene based on previously generated vertex data

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		//clear text area and set font size
		glText.clearRect(0, 0, glText.canvas.width, glText.canvas.height);
		glText.font = "16px serif";
		
		//fills text on the image
		glText.fillText(Math.round(max * 10) / 10, 5, glText.canvas.height / 20, 80);
		glText.fillText(Math.round(max * 15 / 2) / 10, 5, glText.canvas.height / 20 + glText.canvas.height * .225, 80);
		glText.fillText(Math.round(max * 5) / 10, 5, glText.canvas.height / 20 + 2 * glText.canvas.height * .225, 80);
		glText.fillText(Math.round(max * 5 / 2) / 10, 5, glText.canvas.height / 20 + 3 * glText.canvas.height * .225, 80);
		glText.fillText("0.0", 5, glText.canvas.height / 20 + 4 * glText.canvas.height * .225, 50);
		
		//fills bottom axis data based on graphMode
		if (graphMode == "All") {
			glText.fillText("Setosa", 3 * glText.canvas.width / 20, 
				glText.canvas.height - 8, 80);
			glText.fillText("Versicolor", 3 * glText.canvas.width / 20 + glText.canvas.width * .3, 
				glText.canvas.height - 8, 80);
			glText.fillText("Virginica",  3 * glText.canvas.width / 20 + 2 * glText.canvas.width * .3, 
				glText.canvas.height - 8, 80);
		
		}
		else
		{
			glText.fillText(graphMode, 3 * glText.canvas.width / 20 + glText.canvas.width * .3, 
				glText.canvas.height - 8, 80);
		}
		glText.fillText("Sepal Length", glText.canvas.width / 12, glText.canvas.height / 35, 80);
		glText.fillText("Sepal Width", glText.canvas.width / 12 + glText.canvas.width / 4.45, glText.canvas.height / 35, 80);
		glText.fillText("Petal Length", glText.canvas.width / 12 + 2 * glText.canvas.width / 4.45, glText.canvas.height / 35, 80);
		glText.fillText("Petal Width", glText.canvas.width / 12 + 3 * glText.canvas.width / 4.45, glText.canvas.height / 35, 80);
			
		//binds Vertex Position Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//binds Vertex Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// binds vertex index buffer and draws triangles 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, num_indices, gl.UNSIGNED_SHORT, 0);
		
		// binds Axes Position Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, AxesPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, AxesPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		// binds Axes Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, AxesColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, AxesColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		// draws Axes
		gl.drawArrays(gl.LINES, 0, graphMode == "All" ? Axes.length / 3 : SingleAxes.length / 3);
		
	
    }


    // Starts WebGL and sets up program

    function webGLStart() {
		//get canvas elements
        var canvas = document.getElementById("project1Canvas");
		
		var textCanvas = document.getElementById("project1Text");
		
		//initializes canvasses and shaders
        initGL(canvas, textCanvas);
        initShaders();
		
		//links aVertexPosition
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		//links aVertexColor
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		//sets clear color
        gl.clearColor(0.8, 0.8, 0.8, 1.0);

    }


