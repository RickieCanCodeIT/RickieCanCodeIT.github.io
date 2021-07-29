	
//Declare variables
var body = d3.select("body");
var barWidth = 12;
var sortedbarWidth = 36;
var axisWidth = 120;
var padding = 4;
var scale = .00001;
var legendBlockSize = 20;
var names = [];
var data = [];
var totalPops = [];
var groups = [];
var xAxisSpots = [];

var sortedNames = [];
var sortedData = [];
var sortedPops = [];
var sortedGroups = [];
var sortedXAxisSpots = [];

var maxPop = 0;
var colors = [ "Red", "Orange", "Yellow", "Green", "Blue", "Cyan", "Purple"];
var sidebarVals = [ "Size", "Value", "Orientation", "Color", "Shape", "Texture"];

//setup first chart
var svg = body.append("svg");
svg.attr("width", 1000);
svg.attr("height", 600);
svg.append("text")
	.attr("transform", "translate(400, 20)")
	.text("Population by age group")
	.attr("font-size", 20);
d3.csv("census.csv",  get_data);
makeLegend(svg);

//setup second chart
var svgSorted = body.append("svg");
svgSorted.attr("width", 1000);
svgSorted.attr("height", 600);
var svgUSA = body.append("svg");
var usaHeight = 500;
var usaWidth = 800;
var sideBarWidth = 200;
var statesHeight = 200;
var sizeBarHeight = 100;
var stateBarWidth = 10;
var stateGroups = [];
var stateXAxisSpots = [];
var lastColor;
var stateAreas = [];
var scaleG = null;
var shapeG = null;
var orientationG = null;
var selectColor;
var selectedState = -1;
svgUSA.attr("width", usaWidth + sideBarWidth);
svgUSA.attr("height", usaHeight + statesHeight);
d3.json("usa_mainland.json")
.then(drawUSA);
var tooltip = body
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("Future Pop!");
var highlighter;

//gets data row by row, then creates graph once it is all gathered
function get_data(csvdata) {
	//get state data
	names.push(csvdata["State"]);
	delete csvdata["State"];
	data.push(csvdata);
	xAxisSpots.push(axisWidth - 7 + names.length * (barWidth + padding));
	var totalPop = parseInt(csvdata["Under 5 Years"]) + parseInt(csvdata["5 to 13 Years"]) + parseInt(csvdata["14 to 17 Years"]) +
		parseInt(csvdata["18 to 24 Years"]) + parseInt(csvdata["25 to 44 Years"]) + parseInt(csvdata["45 to 64 Years"]) + parseInt(csvdata["65 Years and Over"]);
		
	totalPops.push(totalPop);
	//calculate max pop
	if (maxPop < totalPop) {
		maxPop = totalPop;
	}
	//if there are 51 rows, reading csv is done and now it draws the first chart
	if (data.length == 51) {
		//draw each individual bar for first chart
		for (var counter = 0; counter < 51; counter++) {
			groups.push(svg.append("g"));
			draw_stacks(counter, groups[counter], data, totalPops, barWidth, 30, 540);
		}
		
		//Make X Axis
		var xScale = d3.scaleOrdinal()
			.domain(names)
			.range( xAxisSpots);
		var xAxis = d3.axisBottom(xScale);
		svg.append('g')
			.attr("transform", "translate(0, 570)")
			.call(xAxis);
			
		//Make Y Axis
		var yScale = d3.scaleLinear()
		.domain([0, maxPop])
		.range([540, 0]);
		var yAxis = d3.axisLeft(yScale);
		svg.append('g')
		.attr("transform", "translate(80, 30)")
		.call(yAxis);
		
		//Calls method to create second chart
		sort_data();
	}
}

//sorts and then creates second chart
function sort_data() {
	//initialize sorting data
	sortedNames = names;
	sortedData = data;
	sortedPops = totalPops;
	
	//sorts the states by population
	var changed = 1;
	while (changed == 1) {
		
		changed = 0;
		for (var counter = 0; counter < 50; counter++) {
			if (sortedPops[counter] < sortedPops[counter + 1]) {
				changed = 1;
				var tempName = sortedNames[counter];
				var tempData = sortedData[counter];
				var tempPop = sortedPops[counter];
				sortedNames[counter] = sortedNames[counter + 1];
				sortedData[counter] = sortedData[counter + 1];
				sortedPops[counter] = sortedPops[counter + 1];
				sortedNames[counter + 1] = tempName;
				sortedData[counter + 1] = tempData;
				sortedPops[counter + 1] = tempPop;
			}
		}
	}
	//draws each individual bar for second chart
	var outputNames = [];
	for (var counter = 0; counter < 20; counter++) {
		outputNames.push(sortedNames[counter]);
		sortedXAxisSpots.push(axisWidth + 22 + counter * (sortedbarWidth + padding));
		sortedGroups.push(svgSorted.append("g"));
		draw_stacks(counter, sortedGroups[counter], sortedData, sortedPops, sortedbarWidth, 30, 540);
	}
	
	//makes X axis
	var xScale = d3.scaleOrdinal()
		.domain(outputNames)
		.range(sortedXAxisSpots);
	var xAxis = d3.axisBottom(xScale);
	svgSorted.append('g')
		.attr("transform", "translate(0, 570)")
		.call(xAxis);
		
	//makes Y axis
	var yScale = d3.scaleLinear()
		.domain([0, maxPop])
		.range([540, 0]);
	var yAxis = d3.axisLeft(yScale);
	svgSorted.append('g')
		.attr("transform", "translate(80, 30)")
		.call(yAxis);
	//Final touches on chart
	makeLegend(svgSorted);
	svgSorted.append("text")
		.attr("transform", "translate(400, 20)")
		.text("States by population")
		.attr("font-size", 20);
	svg.remove();
	svgSorted.remove();
}

//draws an individual line
function draw_stacks(index, inGroup, inData, inTotalPops, inBarWidth, inBarY, inBarHeight) {
	//flips rows and columns for one row
	var barData = [parseInt(inData[index]["Under 5 Years"]), parseInt(inData[index]["5 to 13 Years"]), parseInt(inData[index]["14 to 17 Years"]),
		parseInt(inData[index]["18 to 24 Years"]), parseInt(inData[index]["25 to 44 Years"]), parseInt(inData[index]["45 to 64 Years"]), parseInt(inData[index]["65 Years and Over"])];
	//Creates rectangles for the age groups and positions, sizes, and colorizes them
	var rects = inGroup.selectAll("rect").data(barData);
	rects.enter()
	.append("rect")
	.attr("width", inBarWidth)
	.attr("id", 2)
	.attr("name", function(d, i) {
		return index + "|" + i;
	})
	.attr("x", function(d, i) {
		return axisWidth + padding + index * (inBarWidth + padding);
	})
	.attr("y", function(d,i) {
		var baseStart = inBarY + (1 - (inTotalPops[index] / maxPop)) * inBarHeight;
		for (var counter = 0; counter < i; counter++) {
			baseStart = baseStart + (barData[counter] / maxPop * inBarHeight);
		}
		return baseStart;
	})
	.attr("height", function(d,i) {
		return d / maxPop * inBarHeight;
	})
	.attr("fill", function(d,i) {
		return colors[i];
	})
	.on("click", function(d) {
		var indexes = d3.select(this).attr("name").split('|');
		selectState(getStateIndex(sortedNames[indexes[0]]));
	})
	.on("mouseover", function(d) {
		var indexes = d3.select(this).attr("name").split('|');
		return tooltip.text(sortedNames[indexes[0]] + "'s Population: " + totalPops[indexes[0]])
		.style("Visibility", "Visible");
	})
	.on("mousemove", function() {
		return tooltip.style("top", (event.pageY-10 +"px"))
		.style("left", (event.pageX+10 +"px"));
	})
	.on("mouseout", function(d) {
		return tooltip.style("Visibility", "hidden");
	});
}

function selectState(inState) {
	highlighter.attr("transform", function() {
			var center = geoGenerator.centroid(stateAreas.features[inState]);
			return 'translate (' + center + ')';
	})
	/*var statePaths = svgUSA.selectAll("path").nodes();
	if (selectedState != -1) {
		svgUSA.selectAll("path")
		statePaths[selectedState].attr("fill", selectColor);
	}
	selectedState = inState;
	selectColor = statePaths[inState].attr("fill");
	statePaths[inState].attr("fill", "Orange");*/
	
}

function getStateIndex(stateName) {
	for (var counter = 0; counter < 49; counter++) {
		if (stateName == stateAreas.features[counter].properties.STUSPS10) {
			return counter;
		}
	}
}

function draw_sidebar(words) {
	var options = words.length;
	var barHeight = (usaHeight / words.length);
	var wordG = svgUSA.append('g')
			.attr("transform", "translate(800, 0)");
	wordG.selectAll("text")
	.data(words)
	.enter()
	.append("text")
	.attr("x", 10)
	.attr("y", function(d, i) {
		return barHeight * i + 40;
	})
	.attr("width", 180)
	.attr("height", barHeight)
	.style("font-size", 40)
	.text(function(d) {
		return d;
	})
	.on("click", function(d) {
		draw_visualization(d);
	});
	
}

function draw_visualization(type) {
	svgUSA.selectAll('rect').remove();
	svgUSA.selectAll('symbol').remove();
	svgUSA.selectAll('path').attr("fill", "white");
	shapeG.selectAll('path').remove();
	orientationG.selectAll('path').remove();
	if (type == "Size") {
	var paths = svgUSA
		.selectAll('rect')
		.data(stateAreas.features)
		.enter()
		.append('rect')
		.attr("id", 1)
		.attr("fill", "purple")
		.attr("width", 20)
		.attr("height", function(d) {
			return get_relative_height(d.properties.STUSPS10);
		})
		.attr('transform', function(d) {
			var center = geoGenerator.centroid(d);
			return 'translate (' + (center[0] - 10) + ',' + (center[1] - get_relative_height(d.properties.STUSPS10) + 10)  + ')';
		});
		makeScaleUSA(type);
	}
	else if (type == "Value") {
		var paths = svgUSA.selectAll('path')
		.data(stateAreas.features);
		paths.attr("fill", function(d) {
			var totalPop = get_total_pop(d.properties.STUSPS10);
			return d3.rgb(255 - 255 * totalPop / maxPop, 255 - 255 * totalPop / maxPop, 255 - 255 * totalPop / maxPop);
		});
		makeScaleUSA(type);
	}
	else if (type == "Color") {
		var paths = svgUSA.selectAll('path')
		.data(stateAreas.features);
		paths.attr("fill", function(d) {
			var totalPop = get_total_pop(d.properties.STUSPS10);
			return d3.rgb(255 - 255 * totalPop / maxPop, 255 * totalPop / maxPop, 0);
		});
		makeScaleUSA(type);
	}
	else if (type == "Orientation") {
		var paths = orientationG
		.selectAll('path')
		.data(stateAreas.features)
		.enter()
		.append('path')
		.attr('transform', function(d) {
			var center = geoGenerator.centroid(d);
			return 'translate (' + center + ')';
		})
		.attr('d', function(d) {
			var totalPop = get_total_pop(d.properties.STUSPS10);
			var points = [[0, 0], [40 * (1 - (totalPop / maxPop)), -40 * (totalPop / maxPop)]]
			var lineGenerator = d3.line();
			return lineGenerator(points)
		})
		.attr('fill', "cyan")
		.attr('stroke', "black");
		makeScaleUSA(type);
	}
	else if (type == "Shape") {
		var symbolGeneratorCircle = d3.symbol()
			.type(d3.symbolCircle)
			.size(80)
		var symbolGeneratorDiamond = d3.symbol()
			.type(d3.symbolDiamond)
			.size(80)
		var symbolGeneratorSquare = d3.symbol()
			.type(d3.symbolSquare)
			.size(80)
		var symbolGeneratorCross = d3.symbol()
			.type(d3.symbolCross)
			.size(80)
		var symbolGeneratorWye = d3.symbol()
			.type(d3.symbolWye)
			.size(80)
		shapeG.selectAll('path').remove();
		var paths = shapeG
		.selectAll('path')
		.data(stateAreas.features)
		.enter()
		.append('path')
		.attr('transform', function(d) {
			var center = geoGenerator.centroid(d);
			return 'translate (' + center + ')';
		})
		.attr('d', function(d) {
			var popClass = get_pop_class(d.properties.STUSPS10);
			if (popClass <= 1) {
				return symbolGeneratorCircle();
			}
			else if (popClass <= 2) {
				return symbolGeneratorDiamond();
			}
			else if (popClass <= 3) {
				return symbolGeneratorSquare();
			}
			else if (popClass <= 4) {
				return symbolGeneratorCross();
			}
			else {
				return symbolGeneratorWye();
			}
		})
		.attr('fill', "cyan")
		.attr('stroke', "black");
		makeScaleUSA(type);

	}
	else if (type == "Texture") {
		var paths = svgUSA.selectAll('path')
		.data(stateAreas.features);
		paths.attr("fill", function(d) {
			var totalPop = get_total_pop(d.properties.STUSPS10);
			var textureIndex = totalPop / maxPop;
			if (textureIndex < 1 / 9) {
				textureIndex = 1;
			}
			else if (textureIndex < 2 / 9) {
				textureIndex = 2;
			}
			else if (textureIndex < 3 / 9) {
				textureIndex = 3;
			}
			else if (textureIndex < 4 / 9) {
				textureIndex = 4;
			}
			else if (textureIndex < 5 / 9) {
				textureIndex = 5;
			}
			else if (textureIndex < 6 / 9) {
				textureIndex = 6;
			}
			else if (textureIndex < 7 / 9) {
				textureIndex = 7;
			}
			else if (textureIndex < 8 / 9) {
				textureIndex = 8;
			}
			else {
				textureIndex = 9;
			}
			return "url(#circles-" + textureIndex + ")";
		});
		makeScaleUSA(type);
	}
		DrawBars();
}

function initializeScaleUSA() {
	scaleG = svgUSA.append('g')
		.attr("transform", "translate(10, 420)");
	shapeG = svgUSA.append('g')
		.attr("transform", "translate(0, 0)");
	orientationG = svgUSA.append('g')
		.attr("transform", "translate(0, 0)");
	svgUSA.append('text')
		.attr("transform", "translate(100, 450)")
		.attr("width", "280px")
		.attr("height", "40px")
		.text("--- Population  +++");
}

function makeScaleUSA(type) {
	if (type == "Color") {
		var colorScale = d3.scaleOrdinal()
			.domain(["Red", "Brown", "Green"])
			.range([0, 150, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
	else if (type == "Value") {
		var colorScale = d3.scaleOrdinal()
			.domain(["White", "Gray", "Black"])
			.range([0, 150, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
	else if (type == "Shape") {
		var colorScale = d3.scaleOrdinal()
			.domain(["Wye", "Cross", "Square", "Diamond", "Circle"])
			.range([0, 75, 150, 225, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
	else if (type == "Texture") {
		var colorScale = d3.scaleOrdinal()
			.domain(["Small", "Big"])
			.range([0, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
	else if (type == "Orientation") {
		var colorScale = d3.scaleOrdinal()
			.domain(["horizontal", "Vertical"])
			.range([0, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
	else if (type == "Size") {
		var colorScale = d3.scaleOrdinal()
			.domain(["Short", "Tall"])
			.range([0, 300]);
		var colorAxis = d3.axisBottom(colorScale);
		scaleG.call(colorAxis);
	}
}



function get_pop_class(stateName) {
	for (var counter = 0; counter < sortedNames.length; counter++) {
		if (stateName == sortedNames[counter]) {
			return counter / 10;
		}
	}
}


function get_total_pop(stateName) {
	for (var counter = 0; counter < names.length; counter++) {
		if (stateName == names[counter]) {
			return totalPops[counter];
		}
	}
	return 0;
}

function get_relative_height(stateName) {
	
	return sizeBarHeight * (get_total_pop(stateName) / maxPop);
		
}

//makes the legend
function makeLegend(inSVG) {
	//makes base area for legend
	var legend = inSVG.append('g')
		.attr("transform", "translate(800, 10)");
	
	//line for Under 5 years
	legend.append("text")
	.attr("transform", "translate(0, 15)")
	.text("Under 5 Years Old")
	.attr("fill", colors[0]);
	legend.append("rect")
	.attr("transform", "translate(125,0)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[0]);
		
	//line for 5 to 13 years
	legend.append("text")
	.attr("transform", "translate(0, 40)")
	.text("5 to 13 Years")
	.attr("fill", colors[1]);
	legend.append("rect")
	.attr("transform", "translate(125,25)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[1]);
		
	//line for 14 to 17 years
	legend.append("text")
	.attr("transform", "translate(0, 65)")
	.text("14 to 17 Years")
	.attr("fill", colors[2]);
	legend.append("rect")
	.attr("transform", "translate(125,50)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[2]);
		
	//line for 18 to 24 years
	legend.append("text")
	.attr("transform", "translate(0, 90)")
	.text("18 to 24 Years")
	.attr("fill", colors[3]);
	legend.append("rect")
	.attr("transform", "translate(125,75)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[3]);
		
	//line for 25 to 44 years
	legend.append("text")
	.attr("transform", "translate(0, 115)")
	.text("25 to 44 Years")
	.attr("fill", colors[4]);
	legend.append("rect")
	.attr("transform", "translate(125,100)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[4]);
		
	//line for 45 to 64 years
	legend.append("text")
	.attr("transform", "translate(0, 140)")
	.text("45 to 64 Years")
	.attr("fill", colors[5]);
	legend.append("rect")
	.attr("transform", "translate(125,125)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[5]);
		
	//line for 65 Years and Over
	legend.append("text")
	.attr("transform", "translate(0, 165)")
	.text("65 Years and Over")
	.attr("fill", colors[6]);
	legend.append("rect")
	.attr("transform", "translate(125,150)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[6]);
}

var geoGenerator;
function drawUSA(states) {
	stateAreas = states;
	var width = usaWidth;
	var height = usaHeight;

	var projection = d3.geoEquirectangular()
		.fitExtent([[0,0], [width, height]], states);
	
	geoGenerator = d3.geoPath()
		.projection(projection);

	var paths = svgUSA
		.selectAll('path')
		.data(states.features)
		.enter()
		.append('path')
		.attr('d', geoGenerator)
		.attr('id', function(d, i) {
			return i;
		})
		.attr('fill', "white")
		.attr('stroke', "black")
		.on("mouseover", function(d) {
			lastColor = d3.select(this).attr('fill');
			d3.select(this).attr('fill', "orange");
		})
		.on("mouseout", function(d) {
			d3.select(this).attr('fill', lastColor);
		});
	highlighter = svgUSA.append('circle')
	.attr('cx', 0)
	.attr('cy', 0)
	.attr('r', 60)
	.attr('fill', 'pink')
	.attr('transform', 'translate(10000, 10000)')
	.attr('fill-opacity', .4);
	var texts = svgUSA
		.selectAll('text')
		.data(states.features)
		.enter()
		.append('text')
		.attr('text-anchor', 'middle')
		.attr('alignment-baseline', 'middle')
		.attr('opacity', 0.5)
		.text(function(d) {
			return d.properties.STUSPS10;
		})
		.attr('transform', function(d) {
			var center = geoGenerator.centroid(d);
			return 'translate (' + center + ')';
		});
		initializeScaleUSA();
		draw_sidebar(sidebarVals);
		DrawBars();
		//Make X Axis
		var xScale = d3.scaleOrdinal()
			.domain(sortedNames)
			.range( stateXAxisSpots);
		var xAxis = d3.axisBottom(xScale);
		svgUSA.append('g')
			.attr("transform", "translate(128, " + (usaHeight + statesHeight - 20) + ")")
			.call(xAxis);
			
		//Make Y Axis
		var yScale = d3.scaleLinear()
		.domain([0, maxPop])
		.range([usaHeight + statesHeight - 20, usaHeight + 10]);
		var yAxis = d3.axisLeft(yScale);
		svgUSA.append('g')
		.attr("transform", "translate(120, 0)")
		.call(yAxis);
}

function DrawBars() {
	stateXAxisSpots = [];
	for (var counter = 0; counter < 51; counter++) {
		stateGroups.push(svgUSA.append("g"));
		draw_stacks(counter, stateGroups[counter], sortedData, sortedPops, stateBarWidth, usaHeight + 10, statesHeight - 30);
		stateXAxisSpots.push(counter * 14);
	}	
}