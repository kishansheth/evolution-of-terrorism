var w = 1200,
    h = 600,
    pad = 50,
    left_pad = 150,
    Data_url = '/data.json';
 
var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
 
var x = d3.scale.linear().domain([0, 47]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([1, 12]).range([pad, h-pad*2]);
 
var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(48)
        .tickFormat(function (d, i) {
            return d+1970;
        })
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(12)
        .tickFormat(function (d, i) {
            return ['Middle East', 'Africa', 'North America', 'Southeast Asia', 'Thursday', 'Friday', 'Saturday', 'Saturday', 'Saturday', 'Saturday', 'Saturday', 'Saturday', 'Saturday'][d];
        });

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis)
.selectAll("text")
    .attr("transform", "rotate(90)translate(20,-10)");
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);
 
svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y", function () { return h/2-5; });
 
d3.json('https://gist.githubusercontent.com/kishansheth/8e8b21acf9017aeb2cf3fff7c0682f8e/raw/7bdd44f99bb0addc0fc951af371d5dfdd11a2be8/scatterplot_data.json', function (punchcard_data) {
    var max_r = d3.max(punchcard_data.map(
                       function (d) { return d[2]; })),
        r = d3.scale.linear()
            .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
            .range([2, 12]);
 
    svg.selectAll(".loading").remove();
 
    svg.selectAll("circle")
        .data(punchcard_data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .style("fill", function(d) { return "#000000"; })
        .attr("cx", function (d) { return x( parseInt(d[1]) + (parseInt(d[1].substring(5, 6))/12) + (parseInt(d[1].substring(8, 9))/31) - 1970 );})
        .attr("cy", function (d) { return y(d[0]); })
        .transition()
        .duration(1600)
        .attr("r", function (d) { return r(d[2]); });
});

svg.on("click", function() {
    svg.selectAll("circle")  // For new circle, go through the update process
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
  })

function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).style({
      fill: "orange"
    });

      // Specify where to put label of text
    svg.append("text").attr({
    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return x(d.x) - 30; },
        y: function() { return y(d.y) - 15; }
    })
    .text(function() {
        return [d.x, d.y];  // Value of the text
    });
  }

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).style({
      fill: "black"
    });
  }