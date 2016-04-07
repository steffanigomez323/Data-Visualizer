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

		x.domain(d3.extent(data, function(d) { return d[xvar]; }));
		y.domain(d3.extent(data, function(d) { return d[yvar]; }));

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
	    	.x(function(d) { return x(d[xvar]); })
	    	.y(function(d) { return y(d[yvar]); });

	    chart.append("path")
	    	.datum(data)
	    	.attr("class", "line")
	    	.attr("d", line);
};

function barChart(xvar, yvar, data, num) {
	var margin = {top: 10, right: 20, bottom: 20, left: 40},
		    	width = $("#innerchart" + num).width() - margin.left - margin.right,
		    	height = $("#innerchart" + num).height() - margin.top - margin.bottom,
		    	buckets = 7;

	var chart = d3.select("#innerchart" + num)
                        .append("svg") 
                        .attr("width", width + (2 * margin.left) + margin.right)    //set width
                        .attr("height", height + margin.top + margin.bottom)  //set height
                        .append("g")
    					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	//x.domain(data.map(function(d) { return d[xvar]; }));
	//y.domain([0, d3.max(frequency, function(d) { return d.val; })]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var xVals = data.map(function(d) {
			return d[xvar]});
		xVals = xVals.reduce(function(a,b){
	    if (a.indexOf(b) < 0 ) a.push(b);
	    return a;
	  },[])
		.sort(function(a,b){
	    return a > b;
	  });

	var yVals = data.map(function(d) {
			return d[yvar]});
		yVals = yVals.reduce(function(a,b){
	    if (a.indexOf(b) < 0 ) a.push(b);
	    return a;
	  },[])
		.sort(function(a,b){
	    return a > b;
	  });
	 

	if (getType(yvar))  {

		yVals = yVals.filter(function(elem, index, self) {
	    	return index == self.indexOf(elem);
				});
		yVals = yVals.sort(function(a, b){return a-b});
	}

	//color.domain(d3.keys(yVals).filter(function(key) { return key !== "State"; }));

	//console.log(yVals);

	if (yVals.length < 8) {

		var frequency = [];
		for (var i = 0; i < xVals.length; i++) {
			for (var j = 0; j < yVals.length; j++) {
			frequency.push({ name: xVals[i], 
					count: yVals[j], 
					frequency: 0});
			}
		}

		data.forEach(function(d) {
			for (var j = 0; j < frequency.length; j++) {
				if (frequency[j].name === d[xvar] && frequency[j].count === d[yvar]) {
					frequency[j].frequency = frequency[j].frequency + 1;
				}
			}
		});

		//console.log(frequency);

		var counts = [];
		for (var i = 0; i < xVals.length; i++) {
			var values = [];
			y0 = 0;
			for (var j = 0; j < yVals.length; j++) {
				//console.log(i);
				//console.log(j);
				values.push({ name: yVals[j], groupname: xVals[i], y0: y0, y1: y0 += frequency[(i * (xVals.length - 1)) + j].frequency});
			}
			counts.push({ name: xVals[i], freq: values, total: values[values.length - 1].y1});
		}

		counts.sort(function(a, b) { return b.total - a.total; });

		color.domain(yVals);

	}
	else {

		var frequency = [];

		var yGroups = [];
		var min = d3.min(yVals, function(d) { return d; });
		var max = d3.max(yVals, function(d) { return d; });
		var yincr = Math.ceil((max - min) / buckets);
		//console.log(yincr);
		//console.log(yVals.length);

		for (var j = 0; j < buckets; j++) {
			var vals = [];
			for (var l = 0; l < yVals.length; l++) {
				if ((j * yincr) + min <= yVals[(j * yincr) + l] && yVals[(j * yincr) + l] <= (j * yincr) + yincr + min) {
					vals.push(yVals[(j * yincr) + l]);
				}
				if (yVals[(j * yincr) + l] > (j * yincr) + yincr + min) {
					break;
				}
			}
			var index = (j * yincr) + min + yincr;
			if (index > max) {
				index = max;
			}
			var name = String((j * yincr) + min).concat(" - ").concat(String(index));
			yGroups.push({ name: name, values: vals });
			//yGroups.push(name);
		}

		console.log(yGroups);

		for (var i = 0; i < xVals.length; i++) {
			for (var j = 0; j < yGroups.length; j++) {
			frequency.push({ name: xVals[i], 
					groupname: yGroups[j].name, 
					frequency: 0});
			}
		}

		console.log(frequency);

		data.forEach(function(d) {
			for (var j = 0; j < frequency.length; j = j + yGroups.length) {
				//for (var k = 0; k < frequency[j].count.values.length; k++) {
				var b = Math.floor((d[yvar] - min) / yincr);
					/*if (j == 0 && b == 0 && frequency[j].name === d[xvar]) {
						frequency[j].frequency = frequency[j].frequency + 1;
					}
					else if (frequency[j].name === d[xvar] && j % yincr == 0) {
						frequency[j].frequency = frequency[j].frequency + 1;
					}
					else if (frequency[j].name === d[xvar] && j % yincr == 7 && b == 0) {

					}*/
				//}
				//var index = (Math.floor( j / (buckets - 1)) * (buckets - 1);
				//console.log(j);
				//console.log(b);
				//console.log((j * (buckets - 1)) + b);
				//console.log(String(d[yvar]) + " " + d[xvar]);
				if (frequency[j].name === d[xvar]) {
					var index = j + b;
					if (index >= frequency.length) {
						index = frequency.length - 1;
					}
					frequency[index].frequency = frequency[index].frequency + 1;
					//var index = Math.floor( j / (buckets - 1));
					//frequency[index * (buckets - 1) + b].frequency = frequency[index * (buckets - 1)].frequency + 1;
				}
			}
		});

		//console.log(frequency);

		var counts = [];
		for (var i = 0; i < xVals.length; i++) {
			var values = [];
			y0 = 0;
			for (var j = 0; j < yGroups.length; j++) {
				//console.log(i);
				//console.log(j);
				values.push({ name: yGroups[j].name, values: yGroups[j].values, groupname: xVals[i], y0: y0, y1: y0 += frequency[(i * yGroups.length) + j].frequency});
			}
			counts.push({ name: frequency[i * yGroups.length].name, freq: values, total: values[values.length - 1].y1});
		}

		counts.sort(function(a, b) { return b.total - a.total; });
		//color.domain(yGroups.map(function(d) { return d.name }));
		color.domain(yGroups.map(function(d) { return d.name }));

	}

	//console.log(counts);


	x.domain(data.map(function(d) { return d[xvar]; }));
  	y.domain([0, d3.max(counts, function(d) { return d.total; })]);

	chart.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	chart.append("g")
	  .attr("class", "y axis")
	  .call(yAxis);

	var ybar = chart.selectAll(".yvar")
	      	.data(counts)
		.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });


	ybar.selectAll(".rect")
      .data(function(d) { return d.freq; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function(d) {
		  d3.select(this).style("fill", "brown");
		})                  
		.on("mouseout", function(d) {
		  d3.select(this).style("fill", function(d) { return color(d.name); });
		})
		.on("click", function(d) {
			console.log(d.name);
			console.log(xvar);
			console.log(yvar);
			console.log(d);
			var xvalue = d.groupname;
			var yvalue = d.name;
			data = data.filter(function(item) {
			//	console.log(xvalue);
			//	console.log(yvalue);
			//	console.log(d);
				for (var i = 0; i < d.values.length; i++) {
					if (item[xvar] === xvalue) {
						if (item[yvar] === d.values[i]) {
							return item;
						}
					}
				}
			});
			console.log(data);
	  		if (Number(num) % 2 == 1) {
	  			num = String(Number(num) + 1);
	  		}
	  		else {
	  			num = String(Number(num) - 1);
	  		}
	  		console.log(num);
	  		histogram(yvar, xvar, data, num);

		});

	/*chart.selectAll(".bar")
      .data(frequency)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { 	return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return y(d.frequency) - y(d.val); });
      .style("fill", function(d) { return color(d.name); });*/

    var legend = chart.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
};

function heatmap(xvar, yvar, data, num) {
	var margin = {top: 40, right: 20, bottom: 20, left: 100},
		  width = $("#innerchart" + num).width() - margin.left - margin.right,
		  height = $("#innerchart" + num).height() - margin.top - margin.bottom,
          gridSize = Math.floor(width / 18),
          legendElementWidth = gridSize * 1.5,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];//, // alternatively colorbrewer.YlGnBu[9]

      var chart = d3.select("#innerchart" + num)
		  .append("svg") 
		  .attr("width", width + (2 * margin.left) + margin.right)    //set width
		  .attr("height", height + margin.top + margin.bottom)  //set height
		  .append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = data.map(function(d) {
			return d[xvar]});
		x = x.reduce(function(a,b){
	    if (a.indexOf(b) < 0 ) a.push(b);
	    return a;
	  },[])
		.sort(function(a,b){
	    return a > b;
	  });

	var y = data.map(function(d) {
			return d[yvar]});
		y = y.reduce(function(a,b){
	    if (a.indexOf(b) < 0 ) a.push(b);
	    return a;
	  },[])
		.sort(function(a,b){
	    return a > b;
	  });

	if (getType(xvar) && getType(yvar)) {

			var xIncrement = Math.ceil(d3.max(data, function(d) { return d[xvar]}) / buckets);
			var yIncrement = Math.ceil(d3.max(data, function(d) { return d[yvar]}) / buckets);

			//console.log(xIncrement);
			//console.log(yIncrement);
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

			//console.log(totalBuckets);

			data.forEach(function (d) {
				var y = d[yvar];
				var yIndex = (y - (y % yIncrement)) / yIncrement;
				if (yIndex >= buckets) {
					yIndex = buckets - 1;
				}
				var x = d[xvar];
				var xIndex = (x - (x % xIncrement)) / xIncrement; 
				if (xIndex >= buckets) {
					xIndex = buckets - 1;
				}
				//console.log(y);
				//console.log(x);
				//console.log(yIndex);
				//console.log(xIndex);
				totalBuckets[(yIndex * buckets) + xIndex].val = totalBuckets[(yIndex * buckets) + xIndex].val + 1;
		 	});

		 	//console.log(totalBuckets);

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
		                  .domain([0, buckets - 1, d3.max(totalBuckets, function (d) { 
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
         }
         else {
/*
         	var xIncrement = Math.ceil(d3.max(data, function(d) { return d[xvar]}) / buckets);
			var yIncrement = Math.ceil(d3.max(data, function(d) { return d[yvar]}) / buckets);

			//console.log(xIncrement);
			//console.log(yIncrement);
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

			//console.log(totalBuckets);

			data.forEach(function (d) {
				var y = d[yvar];
				var yIndex = (y - (y % yIncrement)) / yIncrement;
				if (yIndex >= buckets) {
					yIndex = buckets - 1;
				}
				var x = d[xvar];
				var xIndex = (x - (x % xIncrement)) / xIncrement; 
				if (xIndex >= buckets) {
					xIndex = buckets - 1;
				}
				//console.log(y);
				//console.log(x);
				//console.log(yIndex);
				//console.log(xIndex);
				console.log(yIndex);
				totalBuckets[(yIndex * buckets) + xIndex].val = totalBuckets[(yIndex * buckets) + xIndex].val + 1;
		 	});

		 	//console.log(totalBuckets);

		 	var yVals = [];
		 	for (var i = 0; i < totalBuckets.length; i = i + 9) {
		 		yVals.push(totalBuckets[i].y);
		 	}
		 	var xVals = [];
		 	for (var j = 0; j < 9; j++) {
		 		xVals.push(totalBuckets[j].x);
		 	}
*/






         	totalBuckets = [];
			for (var i = 0; i < x.length; i++) {
				for (var j = 0; j < y.length; j++) {
					obj = { x: x[i], y: y[j], xcoor: i, ycoor: j, val: 0 };
					totalBuckets.push(obj);
				}
			}

			data.forEach(function (d) {
				var truey = d[yvar];
				var truex = d[xvar];
				for (var i = 0; i < totalBuckets.length; i++) {
					if (totalBuckets[i].x === truex && totalBuckets[i].y === truey) {
						totalBuckets[i].val = totalBuckets[i].val + 1;
					}
				}
		 	});

		 	var xLabels = chart.selectAll(".xLabel")
		          .data(x)
		          .enter().append("text")
		            .text(function(d) { return d; })
		            .attr("x", function(d, i) { return i * gridSize; })
		            .attr("y", 0)
		            .style("text-anchor", "middle")
		            .attr("transform", "translate(" + gridSize / 2 + ", -6)");

		    var yLabels = chart.selectAll(".yLabel")
		          .data(y)
		          .enter().append("text")
		            .text(function (d) { return d; })
		            .attr("x", 0)
		            .attr("y", function (d, i) { return i * gridSize; })
		            .style("text-anchor", "end")
		            .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

		          var colorScale = d3.scale.quantile()
		                  .domain([0, buckets - 1, d3.max(totalBuckets, function (d) { 
		                    return d.val; })])
		                  .range(colors);

		          var cards = chart.selectAll(".x")
		              .data(totalBuckets);

		          cards.append("title");

		          cards.enter().append("rect")
		              .attr("x", function(d) { return d.xcoor * gridSize; })
		              .attr("y", function(d) { return d.ycoor * gridSize; })
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

         }

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
            .attr("y", height);

          legend.exit().remove();

};

function histogram(xvar, yvar, data, num) {

	$("#innerchart" + num).empty();

	console.log(data);
	console.log(xvar);

	var margin = {top: 40, right: 20, bottom: 20, left: 30},
		  width = $("#innerchart" + num).width() - margin.left - margin.right,
		  height = $("#innerchart" + num).height() - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .domain([d3.min(data, function(d) { return d[xvar] }), d3.max(data, function(d) { return d[xvar]; })])
	    .range([0, width]);

	var xVals = data.map(function(d) { return d[xvar]});

	//xVals = xVals.filter(function(item, pos) {
    //	return xVals.indexOf(item) == pos;
	//});

	console.log(xVals);



	for (var i = xVals.length - 1; i >= 0; i--) {
    	if(xVals[i] === 0) {
       		xVals.splice(i, 1);
    	}
	}

	var bardata = d3.layout.histogram()
	    .bins(x.ticks(20))
	    (xVals);

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

	console.log(bardata);

	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(bardata[0].dx + bardata[0].x) - 1)
	    .attr("height", function(d) { return height - y(d.y); });

	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", -14)
	    .attr("x", x(bardata[0].x + bardata[0].dx) / 2)
	    .style("fill", "black")
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });

	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
};

function scatterplot(xvar, yvar, data, num) {
	var margin = {top: 40, right: 20, bottom: 20, left: 30},
	  width = $("#innerchart" + num).width() - margin.left - margin.right,
	  height = $("#innerchart" + num).height() - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select("#innerchart" + num).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d[xvar]; })).nice();
  y.domain(d3.extent(data, function(d) { return d[yvar]; })).nice();

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  chart.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d[xvar]); })
      .attr("cy", function(d) { return y(d[yvar]); })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 1);
          tooltip.html(xvar + ", " + yvar + "<br/> (" + d[xvar] 
	        + ", " + d[yvar] + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  	$("circle").click(function() {
  		if (Number(num) % 2 == 1) {
  			num = String(Number(num) + 1);
  		}
  		else {
  			num = String(Number(num) - 1);
  		}
  		histogram(xvar, yvar, data, num);
  	});
};