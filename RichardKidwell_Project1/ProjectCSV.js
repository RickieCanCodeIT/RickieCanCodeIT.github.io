
var has_data = false;
var data;
var has_avgs = false;
var setosaAvgs = [];
var setosaCount = 0;
var versicolorAvgs = [];
var versicolorCount = 0;
var virginicaAvgs = [];
var virginicaCount = 0;

//sets data from csv file
function set_data(lines) {
    data = lines;
    has_data = true;
}

//draws a specific type of graph
function csv_draw_type(inType) {
	calculate_averages();
    createSpecificGraph(inType, setosaAvgs, versicolorAvgs, virginicaAvgs);
	
}

//calculates all averages
function calculate_averages() {
	//clears avg data
	setosaAvgs = [];
	setosaCount = 0;
	versicolorAvgs = [];
	versicolorCount = 0;
	virginicaAvgs = [];
	virginicaCount = 0;
	//initializes arrays
	for (var i=0; i <data[0].length; i++) {
		setosaAvgs.push(0);
		versicolorAvgs.push(0);
		virginicaAvgs.push(0);
	}
	//fills arrays while counting flower types
    for (var i=0; i<data.length; i++) {
	var flowerType = data[i][0];
	    if (flowerType == "setosa") { 
			setosaCount++;
		}
	    else if (flowerType == "versicolor") { 
			versicolorCount++;
		}
	    else if (flowerType == "virginica") { 
			virginicaCount++;
		}
	for (var j=1; j<data[i].length; j++) {
	    if (flowerType == "setosa") { 
			setosaAvgs[j - 1]+=Number(data[i][j]); 
		}
	    else if (flowerType == "versicolor") { 
			versicolorAvgs[j - 1]+=Number(data[i][j]); 
		}
	    else if (flowerType == "virginica") { 
			virginicaAvgs[j - 1]+=Number(data[i][j]); 
		}
	} 
    }
	//finds the averages
	for (var i = 0; i < setosaAvgs.length; i++) {
		setosaAvgs[i] = setosaAvgs[i] / setosaCount;
	}
	for (var i = 0; i < versicolorAvgs.length; i++) {
		versicolorAvgs[i] = versicolorAvgs[i] / versicolorCount;
	}
	for (var i = 0; i < virginicaAvgs.length; i++) {
		virginicaAvgs[i] = virginicaAvgs[i] / virginicaCount;
	}

    has_avgs = true;
}

//Draws the graph of all data
function csv_draw_all() {
	calculate_averages();
    createAllGraphs(setosaAvgs, versicolorAvgs, virginicaAvgs); 
    
}
