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
		console.log(data);
		console.log(num);

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
		y.domain([0, d3.max(data, function(d) { return d[yvar]; })]);

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
	});

}