	
//Declare variables
var body = d3.select("body");
var barWidth = 12;
var sortedbarWidth = 36;
var axisWidth = 80;
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
			draw_stacks(counter, groups[counter], data, totalPops, barWidth);
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
		draw_stacks(counter, sortedGroups[counter], sortedData, sortedPops, sortedbarWidth);
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
}

//draws an individual line
function draw_stacks(index, inGroup, inData, inTotalPops, inBarWidth) {
	//flips rows and columns for one row
	var barData = [parseInt(inData[index]["Under 5 Years"]), parseInt(inData[index]["5 to 13 Years"]), parseInt(inData[index]["14 to 17 Years"]),
		parseInt(inData[index]["18 to 24 Years"]), parseInt(inData[index]["25 to 44 Years"]), parseInt(inData[index]["45 to 64 Years"]), parseInt(inData[index]["65 Years and Over"])];
	//Creates rectangles for the age groups and positions, sizes, and colorizes them
	var rects = inGroup.selectAll("rect").data(barData);
	rects.enter()
	.append("rect")
	.attr("width", inBarWidth)
	.attr("x", function(d, i) {
		return axisWidth + padding + index * (inBarWidth + padding);
	})
	.attr("y", function(d,i) {
		var baseStart = 30 + (1 - (inTotalPops[index] / maxPop)) * 540;
		for (var counter = 0; counter < i; counter++) {
			baseStart = baseStart + (barData[counter] / maxPop * 540);
		}
		return baseStart;
	})
	.attr("height", function(d,i) {
		return d / maxPop * 540;
	})
	.attr("fill", function(d,i) {
		return colors[i];
	});
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