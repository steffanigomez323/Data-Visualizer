$(document).ready(function() {
	$('#dataset').val("cars").trigger('change');
	drawChart("mpg", "mpg", "1", "cars");
	drawChart("mpg", "mpg", "2", "cars");
});

/** 
* This function is called when a dataset is selected via the select box. It reads from the appropriate .ini file
* and retrieves the names of each column of the associated .csv file and the names of columns I will actually
* display, and passes them to the drawChart function.
*/
function selectOption(x) {
	var columns = new Array();
	var attributes = new Array();
	d3.text('data/' + x.value + '.ini', function(d) {
		var data = d.split("\n");

		for (var j = 0; j < data.length; j++) {
			var s = data[j].split("=");
			if (s[0] === "Names") {
				var c = s[1].split(",");
				columns = columns.concat(c);
			}
			if (s[0] === "IsDisplayed" && columns.length != 0) {
				var a = s[1].toLowerCase().split(",");
				for (var i = 0; i < a.length; i++) {
					a[i] = a[i].replace(/\r/g, "");
					if (a[i] == "true") {
						attributes.push(columns[i]);
					}
				}
			}
		}
		if (attributes.length == 0) {
			attributes = columns;
		}
		//console.log(columns); // sanity check
		//console.log(attributes); // sanity check
		//drawChart(columns, attributes, x);
		createAxisOptions(attributes);
	});
}

/**
* This method dynamically adds options to the select drop downs within the charts that choose what data 
* features to compare with. 
*/

function createAxisOptions(attr) {
	for (var j = 1; j < 3; j++) {

		$('#yaxis' + j).find('option').remove();
		var select = document.getElementById("yaxis" + j);

		for (var i = 0; i < attr.length; i++) {
			var option = document.createElement("option");
			option.text = attr[i];
		    select.add(option);
		}

		$('#xaxis' + j).find('option').remove();
		select = document.getElementById("xaxis" + j);

		for (var i = 0; i < attr.length; i++) {
			var option = document.createElement("option");
			option.text = attr[i];
		    select.add(option);
		}
		
	}
}

/**
This function handles redrawing the chart every time that a new option/axis is selected for one of the charts.
*/

function chartSelectOption(option) {
	var opt = $(option).val();
	var selector = $(option).attr("id");
	var letter = selector.substring(0, 1);
	var opt2;
	if (letter === "y") {
		opt2 = $("#x" + selector.substring(1, selector.length)).val();
		var tmp = opt;
		opt = opt2;
		opt2 = tmp;
	}
	else {
		opt2 = $("#y" + selector.substring(1, selector.length)).val();
	}

	var num = selector.substring(selector.length - 1, selector.length);

	$("#innerchart" + num).empty();

	drawChart(opt, opt2, num, $('#dataset').val());

}

/**
Begin drawing the chart by drawing the axis.
*/

function drawChart(axis1, axis2, chart, file) {
	var num = chart;
	var xvar = axis1;
	var yvar = axis2;
	d3.csv('data/' + file + '.csv', function(data) {
		//console.log(data);
		//console.log(num);

		if (xvar == yvar) {

			lineChart(xvar, yvar, data, num);

		}
		else {

			//barChart(xvar, yvar, data, num);
			heatmap(xvar, yvar, data, num);

			/*var margin = {top: 10, right: 20, bottom: 20, left: 40},
		    	width = $("#innerchart" + num).width() - margin.left - margin.right,
		    	height = $("#innerchart" + num).height() - margin.top - margin.bottom;

			var chart = d3.select("#innerchart" + num)
		                        .append("svg") 
		                        .attr("width", width + (2 * margin.left) + margin.right)    //set width
		                        .attr("height", height + margin.top + margin.bottom)  //set height
		                        .append("g")
		    					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);

			//var x = d3.scale.linear()
			//	.range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			console.log(xvar);
			console.log(yvar);

			x.domain(data.map(function(d) { return d[xvar]; }));
			y.domain([0, d3.max(data, function(d) { return +d[yvar]; })]);

			//x.domain(d3.extent(data, function(d) { return +d[xvar]; }));
			//y.domain(d3.extent(data, function(d) { return +d[yvar]; }));

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");


			chart.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)

			chart.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { 	return x(d[xvar]); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(+d[yvar]); })
		      .attr("height", function(d) { return height - +y(d[yvar]); });*/

		    /*var line = d3.svg.line()
		    	.x(function(d) { return x(+d[xvar]); })
		    	.y(function(d) { return y(+d[yvar]); });

		    chart.append("path")
		    	.datum(data)
		    	.attr("class", "line")
		    	.attr("d", line);*/
		}
	});

}

function lineChart(xvar, yvar, data, num) {
	var margin = {top: 10, right: 20, bottom: 20, left: 40},
	    	width = $("#innerchart" + num).width() - margin.left - margin.right,
	    	height = $("#innerchart" + num).height() - margin.top - margin.bottom;

		var chart = d3.select("#innerchart" + num)
	                        .append("svg") 
	                        .attr("width", width + (2 * margin.left) + margin.right)    //set width
	                        .attr("height", height + margin.top + margin.bottom)  //set height
	                        .append("g")
	    					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		//console.log(xvar);
		//console.log(yvar);


		x.domain(d3.extent(data, function(d) { return +d[xvar]; }));
		y.domain(d3.extent(data, function(d) { return +d[yvar]; }));

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");


		chart.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		chart.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)

	    var line = d3.svg.line()
	    	.x(function(d) { return x(+d[xvar]); })
	    	.y(function(d) { return y(+d[yvar]); });

	    chart.append("path")
	    	.datum(data)
	    	.attr("class", "line")
	    	.attr("d", line);
}

function barChart(xvar, yvar, data, num) {
	var margin = {top: 10, right: 20, bottom: 20, left: 40},
		    	width = $("#innerchart" + num).width() - margin.left - margin.right,
		    	height = $("#innerchart" + num).height() - margin.top - margin.bottom;

			var chart = d3.select("#innerchart" + num)
		                        .append("svg") 
		                        .attr("width", width + (2 * margin.left) + margin.right)    //set width
		                        .attr("height", height + margin.top + margin.bottom)  //set height
		                        .append("g")
		    					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			console.log(xvar);
			console.log(yvar);

			x.domain(data.map(function(d) { return d[xvar]; }));
			y.domain([0, d3.max(data, function(d) { return +d[yvar]; })]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");


			chart.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)

			chart.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { 	return x(d[xvar]); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(+d[yvar]); })
		      .attr("height", function(d) { return height - +y(d[yvar]); });
}

function heatmap(xvar, yvar, data, num) {
	var margin = {top: 40, right: 20, bottom: 20, left: 40},
		  width = $("#innerchart" + num).width() - margin.left - margin.right,
		  height = $("#innerchart" + num).height() - margin.top - margin.bottom,
          gridSize = Math.floor(width / 18),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];//, // alternatively colorbrewer.YlGnBu[9]

      var chart = d3.select("#innerchart" + num)
		  .append("svg") 
		  .attr("width", width + (2 * margin.left) + margin.right)    //set width
		  .attr("height", height + margin.top + margin.bottom)  //set height
		  .append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = data.map(function(d) {
		return +d[xvar]});
	x = x.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[])
	.sort(function(a,b){
    return a > b;
  });

	var y = data.map(function(d) {
		return +d[yvar]});
	y = y.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[])
	.sort(function(a,b){
    return a > b;
  });

	var xIncrement = Math.ceil(d3.max(data, function(d) { return +d[xvar]}) / buckets);
	var yIncrement = Math.ceil(d3.max(data, function(d) { return +d[yvar]}) / buckets);

	console.log(xIncrement);
	console.log(yIncrement);
	totalBuckets = [];
	xsum = 0;
	ysum = 0;
	for (var i = 0; i < buckets; i++) {
		for (var j = 0; j < buckets; j++) {
			obj = { x: xsum, y: ysum, val: 0 };
			totalBuckets.push(obj);
			xsum += xIncrement;
		}
		ysum += yIncrement;
		xsum = 0;
	}

	console.log(totalBuckets);
	data.forEach(function (d) {
		var y = +d[yvar];
		var yIndex = (y - (y % yIncrement)) / yIncrement;
		//var yIndex = Math.floor(y % buckets);
		//if (yIndex == 0) {
		//	yIndex = Math.floor(y / yIncrement);
		//}
		var x = +d[xvar];
		var xIndex = (x - (x % xIncrement)) / xIncrement; //Math.floor(x % xIncrement);
		//if (xIndex == 0) {
		//	xIndex = Math.floor(x / xIncrement);
		//}
		//console.log(yIndex);
		//console.log((yIndex * buckets) + xIndex);
		totalBuckets[(yIndex * buckets) + xIndex].val = totalBuckets[(yIndex * buckets) + xIndex].val + 1;
 	})

 	console.log(totalBuckets);

 	var yVals = [];
 	for (var i = 0; i < totalBuckets.length; i = i + 9) {
 		yVals.push(totalBuckets[i].y);
 	}
 	var xVals = [];
 	for (var j = 0; j < 9; j++) {
 		xVals.push(totalBuckets[j].x);
 	}

 	var xLabels = chart.selectAll(".xLabel")
          .data(xVals)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)");

    var yLabels = chart.selectAll(".yLabel")
          .data(yVals)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

          var colorScale = d3.scale.quantile()
                  .domain([0, d3.max(totalBuckets, function (d) { 
                    return d.val; })])
                  .range(colors);

          var cards = chart.selectAll(".x")
              .data(totalBuckets);

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return ((d.x - (d.x % xIncrement)) / xIncrement) * gridSize; })
              .attr("y", function(d) { return ((d.y - (d.y % yIncrement)) / yIncrement) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "bucket bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.val); });

          cards.select("title").text(function(d) { return d.val; });
          
          cards.exit().remove();

          var legend = chart.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 50)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - gridSize);

          legend.exit().remove();

}