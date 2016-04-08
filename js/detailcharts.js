/**
* This function, given data, the chart number, and an x- and y-variable constructs a histogram.
* This is displayed when a stacked bar or a point on a scatterplot is clicked upon.
*/

function histogram(xvar, yvar, data, num) {

	$("#innerchart" + num).empty();

	var margin = {top: 40, right: 20, bottom: 20, left: 30},
		  width = $("#innerchart" + num).width() - margin.left - margin.right,
		  height = $("#innerchart" + num).height() - margin.top - margin.bottom;

	var xmin = d3.min(data, function(d) { return d[xvar]; });
	var xmax = d3.max(data, function(d) { return d[xvar]; });

	var x;
	if (!getType(xvar)) {
		x = d3.scale.ordinal()
			.domain(data.map(function(d) { return d[xvar]; }));
	} else {
		x = d3.scale.linear()
	    	.domain([xmin, xmax])
	    	.range([0, width]);
	}

	var xVals = data.map(function(d) { return d[xvar]});

	for (var i = xVals.length - 1; i >= 0; i--) {
    	if(xVals[i] === 0) {
       		xVals.splice(i, 1);
    	}
	}

	var bardata = d3.layout.histogram()
		.bins(x.ticks(20))(xVals);

	var y = d3.scale.linear()
	    .domain([0, d3.max(bardata, function(d) { return d.y; })])
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var chart = d3.select("#innerchart" + num).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = chart.selectAll(".bar")
	    .data(bardata)
	  .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
	    .attr("x", 0)
	    .attr("width", x(bardata[0].dx + xmin))
	    .attr("height", function(d) { return height - y(d.y); });

	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", -14)
	    .attr("x", x(bardata[0].dx + xmin) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; })
	    .style("fill", "black");

	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
};

/**
* This function, given data, the chart number, and an x- and y-variable constructs a bar chart,
* of one bar displaying the count of obversations with particular values. This is displayed 
* when a square in the heatmap is clicked on or when stacked bar graphs are clicked upon.
*/

function barChart(xvar, yvar, data, num) {
	var margin = {top: 40, right: 20, bottom: 20, left: 60},
	  width = $("#innerchart" + num).width() - margin.left - margin.right,
	  height = $("#innerchart" + num).height() - margin.top - margin.bottom;

	$("#innerchart" + num).empty();

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var chart = d3.select("#innerchart" + num).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var xmax = d3.max(data, function(d) { return d[xvar]; });
	  var xVals = data.map(function(d) { return d[xvar]; });

	  var bardata = [];
	  var count = 0;
	  for (var i = 0; i < data.length; i++) {
	  	if (!getType(xvar)) {

	  	}
		if (data[i][xvar] === xmax) {
			count++;
		}
	}
	bardata.push({ dx: 0.5, x: xmax, y: count });

	  x.domain(data.map(function(d) { return d[xvar]; }));
	  y.domain([0, d3.max(bardata, function(d) { return d.y; })]);

	  chart.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  chart.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Frequency");

	  chart.selectAll(".bar")
	      .data(bardata)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.x); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.y); })
	      .attr("height", function(d) { return height - y(d.y); });
};