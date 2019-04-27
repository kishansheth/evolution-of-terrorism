var savematch = []
function processcsv(features,decade){
	d3.csv("https://gist.githubusercontent.com/haoshuai999/fcc38f23dba68f889cf7fc34c131d6c4/raw/3ef832b6c24750e453b74a9359a50322343ccdfb/nattacks.csv", function(attackdata) {
		for (var i = 0; i < features.length; i++) {
			for (var j = 0; j < attackdata.length; j++) {
				if(features[i].properties.name==attackdata[j].country){
					savematch.push([i,j])
				}
			}
		}
	})
};
function changecolor(decade){

	var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")			
		    .style("opacity", 0);


	d3.csv("https://gist.githubusercontent.com/haoshuai999/fcc38f23dba68f889cf7fc34c131d6c4/raw/3ef832b6c24750e453b74a9359a50322343ccdfb/nattacks.csv", function(attackdata) {
		d3.json("https://gist.githubusercontent.com/haoshuai999/6648576cf22f9696805bd0436c6bd0fe/raw/0a9598b48a4314b2e53b29e0e434c14dc993c235/worldrough.geo.json", function(data) {
			colorfill = []
			num_of_attack = []
			for(var k = 0; k < savematch.length; k++){
				i = savematch[k][0]
				j = savematch[k][1]
				if(attackdata[j].decade == decade){
					if(attackdata[j].decade == decade){
						num_of_attack[i] = attackdata[j].nattack
					}
					if(parseInt(attackdata[j].nattack) > 5000 ){
						colorfill[i]="#a70000"
					}
					else if(parseInt(attackdata[j].nattack) > 2000 && parseInt(attackdata[j].nattack) <= 5000){
						colorfill[i]="#ff0000"
					}
					else if(parseInt(attackdata[j].nattack) > 1000 && parseInt(attackdata[j].nattack) <= 2000){
						colorfill[i]="#ff5252"
					}
					else if(parseInt(attackdata[j].nattack) > 100 && parseInt(attackdata[j].nattack) <= 1000){
						colorfill[i]="#ff7b7b"
					}
					else if(parseInt(attackdata[j].nattack) >= 0 && parseInt(attackdata[j].nattack) <= 100){
						colorfill[i]="#ffbaba"
					}
				}
			}
			d3.select(".sticky1").selectAll("path")
				.attr("fill", function(data,i) {
					return colorfill[i]
				})
				.on("mouseover",function(d,i){
					div.transition()		
		                .duration(200)		
		                .style("opacity", .9);		
		            div.html(data.features[i].properties.name + ": " + num_of_attack[i])	
		                .style("left", (d3.event.pageX) + "px")		
		                .style("top", (d3.event.pageY - 28) + "px");			
				})
				.on("mouseout",function(d,i){
					div.transition()		
		                .duration(500)		
		                .style("opacity", 0);	
				})
		})
	})
}
function worldmap(decade){
	var width = 1060,
		  height = 521;

	var svg = d3.select(".sticky1").append("svg")
	  .attr("width", width)
	  .attr("height", height);

	// Add background
	svg.append('rect')
	  .style("fill", "#fff")
	  .attr('width', width)
	  .attr('height', height);

	var g = svg.append('g');

	var xym = d3.geo.mercator()
						.center([10,41])
						.scale(150)
						.translate([width/2, height/2]);
	var path = d3.geo.path().projection(xym);

	// Customize the projection to make the center of Thailand become the center of the map



	d3.json("https://gist.githubusercontent.com/haoshuai999/6648576cf22f9696805bd0436c6bd0fe/raw/0a9598b48a4314b2e53b29e0e434c14dc993c235/worldrough.geo.json", function(data) {
		var attacks = processcsv(data.features,decade)

		setTimeout(function(){
			g.selectAll("path").data(data.features)
			.enter().append("path")
			.attr("d", path)
			.attr('vector-effect', 'non-scaling-stroke')
		}, 1500)
	  
	});

}
function drawline(data){
	//Get width of page
	var chartwidth = parseInt(d3.select(".sticky2").style("width")) * 0.9;
	
	// Set the margins
	var margin = {top: 20, right: 15, bottom: 60, left: 100},
		width = chartwidth - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	// Set up the format to match that of the data that is being read in - have a look here for a list of formats - https://github.com/mbostock/d3/wiki/Time-Formatting
	var parseDate = d3.time.format("%Y").parse;
	
	// Setting up the scaling objects		
	var x = d3.time.scale()
		.range([0, width]);
	
	// Same for the y axis
	var y = d3.scale.linear()
		.range([height, 0]);
	
	// Same for colour.
	var color = d3.scale.category10();
	
	//Setting x-axis up here using x scaling object
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	
	//Setting y-axis up here using y scaling object
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickSize(-width);
		
	// Setting up a d3 line object - used to draw lines later
	var line = d3.svg.line() 
		.x(function(d) { return x(d.date); }) 
		.y(function(d) { return y(d.population); });
	
	
	// Now to actually make the chart area
	var svg = d3.select(".sticky2").append("svg")
		.attr("class", "svgele") 
		.attr("id", "svgEle")  
		.attr("width", width + margin.left + margin.right) 
		.attr("height", height + margin.top + margin.bottom)
	  .append("g") 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	 
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
	  		  
	  // Take each row and put the date column through the parsedate form we've defined above.	
	  data.forEach(function(d) {
		d.date = parseDate(d.date);
	  });
	
	  // Building an object with all the data in it for each line
	  projections = color.domain().map(function(name) {
		return {
		  name: name,
		  values: data.map(function(d) {
			return {date: d.date, population: +d[name]};
			 })
		};
	  });
	  
	  // Set the domain of the x-value
	  x.domain(d3.extent(data, function(d) { return d.date; }));
	
	  // Do the same for the y-axis...[0,800000] by looking at the minimum and maximum for the population variable.
	  y.domain([
		d3.min(projections, function(c) { return d3.min(c.values, function(v) { return v.population; }); }),
		d3.max(projections, function(c) { return d3.max(c.values, function(v) { return v.population; }); })
	  ]);
	  
	  
	  
	  // Bind the x-axis to the svg object
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text") 
		  .attr("y", 40) 
		  .attr("x", width/2 ) //place the year label in the middle of the axis
		  .attr("dx", ".71em") 
		  .style("text-anchor", "end")
		  .text("Year");
	
		// append the yAxis and add label as before.
	  svg.append("g")
		  .attr("class", "y axis")
		  .attr("id", "#yAxis")
		  .call(yAxis)
		.append("text")
		  .attr("y", 0)
		  .attr("x", 0)
		  .attr("dy", ".71em")
		  .style("text-anchor", "start")
		  .text("Percentage");
	  

		//create proj
		var proj = svg.selectAll(".proj")
				.data(projections)
				.enter()
				.append("g")
				.attr("class", "proj");
		
		// Drawing the lines
			proj.append("path")
				.attr("class", "line")
				.attr("id" , function(d, i){
					return "line" + i;
				})
				.attr("stroke-linecap","round")
			  .attr("d", function(d,i) {
				  return line(d.values);
				 })
			  .style("stroke", function(d) { return color(d.name); });
			
		//Initially set the lines to not show	
		 d3.selectAll(".line").style("opacity","0");

		 //Draw all lines onload
		animatelines();
}
function showlinechart(){
	// Load in the data now...
	
	d3.csv("https://gist.githubusercontent.com/haoshuai999/dbe67bcac6101074962a2de18298466c/raw/d56fe7857463c1d86989ad078a7e7db8927c8ca7/data.csv", function(error, data) {

	 	drawline(data);

	})
};
function animatelines(){

	d3.selectAll(".line").style("opacity","0.5");

	
	//Select All of the lines and process them one by one
	d3.selectAll(".line").each(function(d,i){

	// Get the length of each line in turn
	var totalLength = d3.select("#line" + i).node().getTotalLength();

		d3.selectAll("#line" + i)
		  .attr("stroke-dasharray", totalLength + " " + totalLength)
		  .attr("stroke-dashoffset", totalLength)
		  .transition()
		  .duration(5000)
		  .delay(100*i)
		  .ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
		  .attr("stroke-dashoffset", 0)
		  .style("stroke-width",3)
	})		 
			 
};

function showlinechart2(){

	d3.csv("https://gist.githubusercontent.com/haoshuai999/dbe67bcac6101074962a2de18298466c/raw/d56fe7857463c1d86989ad078a7e7db8927c8ca7/data.csv", function(error, data) {

	 	drawline(data);

	})
// var width = 1200,
//     height = 500;

// var nodes1 = [];
// var nodes2 = [];

// var color1 = '#00FF00';
// var color2 = '#FF0000';

// var svg = d3.select(".sticky2").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var force = d3.layout.force()
//     .charge(-20)
//     .size([width, height])
//     .nodes(nodes1)
//     .on("tick", tick)
//     .start();

// var force2 = d3.layout.force()
//     .charge(-20)
//     .size([width, height])
//     .nodes(nodes2)
//     .on("tick", tick)
//     .start();

// function tick() {
// 	  svg.selectAll(".class1")
// 	      .attr("cx", function(data1) { return data1.x - 300; })
// 	      .attr("cy", function(data1) { return data1.y; });
// 	  svg.selectAll(".class2")
// 	      .attr("cx", function(data2) { return data2.x + 100; })
// 	      .attr("cy", function(data2) { return data2.y; });
// 	}

// 	var interval = setInterval(function() {
// 	  var data1 = {
// 	    x: width / 2 + 2 * Math.random() - 1,
// 	    y: height / 2 + 2 * Math.random() - 1
// 	  };
// 	  var data2 = {
// 	    x: width / 2 + 2 * Math.random() - 1,
// 	    y: height / 2 + 2 * Math.random() - 1
// 	  };

// 	  svg.append("circle")
// 	      .data([data1])
// 	      .attr("r", 1e-6)
// 	      .attr('class', 'class1')
// 	    .transition()
// 	      .ease(Math.sqrt)
// 	      .attr("r", 4.5);

// 	  svg.append("circle")
// 	      .data([data2])
// 	      .attr("r", 1e-6)
// 	      .attr('class', 'class2')
// 	    .transition()
// 	      .ease(Math.sqrt)
// 	      .attr("r", 4.5);

// 	  svg.selectAll('.class1')
// 	    .attr('fill', color1)

// 	  svg.selectAll('.class2')
// 	    .attr('fill', color2)

// 	  if (nodes1.push(data1) > 100) clearInterval(interval);
// 	  if (nodes2.push(data2) > 100) clearInterval(interval);
// 	  force.start();
// 	  force2.start();
// 	}, 1);

};

// using d3 for convenience
var main = d3.select('main');
var scrolly = main.select('#scrolly');
var figure1 = scrolly.select('.sticky1');
var figure2 = scrolly.select('.sticky2');
var article1 = scrolly.select('.scroll1');
var article2 = scrolly.select('.scroll2');
var step1 = article1.selectAll('.step');
var step2 = article2.selectAll('.step');
var step = scrolly.selectAll('.step');
// Create 2 datasets
// var data1 = [
// {ser1: 0.3, ser2: 4},
// {ser1: 2, ser2: 16},
// {ser1: 3, ser2: 8}
// ];

// var data2 = [
// {ser1: 1, ser2: 7},
// {ser1: 4, ser2: 1},
// {ser1: 6, ser2: 8}
// ];

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var scrollyWidth = window.innerWidth * 0.98

	scrolly
		.style('width', scrollyWidth + 'px')

	var stepH = Math.floor(window.innerHeight * 0.75);
	step1.style('height', stepH + 'px');
	step2.style('height', stepH + 'px');

	var figureHeight = window.innerHeight / 1.2
	var figureMarginTop = (window.innerHeight - figureHeight) / 2  

	figure1
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	figure2
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	//console.log(response)
	// response = { element, direction, index }
	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})
	// step2.classed('is-active', function (d, i) {
	// 	return i === response.index;
	// })

	// update graphic based on step
	figure1.select('p').text(response.index);
	figure2.select('p').text(response.index);

	//console.log(response.index)
	if (response.direction == 'down' && response.index < 5){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1);
	}
	else if (response.direction == 'up' && response.index < 5){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1)
	}

	if (response.direction == 'down' && response.index >= 5 && response.index <= 7){
		d3.select('.sticky2 svg').remove();
		showlinechart();
	}
	else if (response.direction == 'up' && response.index <= 7){
		d3.select('.sticky2 svg').remove();
		showlinechart();
	}
	else if (response.direction == 'down' && response.index > 7 ) {
		d3.select('.sticky2 svg').remove();
		showlinechart2();
	}
	// else if (response.direction == 'up' && response.index <= 8 ) {
	// 	d3.select('.sticky2 svg').remove();
	// 	showlinechart2(data1);
	// }
	// else if (response.direction == 'down' && response.index > 8 ) {
	// 	d3.select('.sticky2 svg').remove();
	// 	showlinechart2(data2);
	// }

}

function setupStickyfill() {
	d3.selectAll('.sticky').each(function () {
		Stickyfill.add(this);
	});
}

function init() {
	setupStickyfill();

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		step: '#scrolly article .step',
		offset: 0.33,
		debug: true,
	})
		.onStepEnter(handleStepEnter)

	// setup resize event
	window.addEventListener('resize', handleResize);
	worldmap();
}

// kick things off
init();