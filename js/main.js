$(document).ready(function() {
	$('#dataset').val("cars").trigger('change');
});

var optionsattr = [];

/**
* This function returns a 1 if the attribute is a number, and 0 if it is a string
*/ 
function getType(x) {
	for (var i = 0; i < optionsattr.length; i++) {
		if (optionsattr[i].name === x) {
			return optionsattr[i].type;
		}
	}
}

/** 
* This function is called when a dataset is selected via the select box. It reads from the appropriate .ini file
* and retrieves the names of each column of the associated .csv file and the names of columns I will actually
* display, and passes them to the drawChart function.
*/
function selectOption(x) {
	var columns = new Array();
	var attributes = new Array();
	optionsattr = [];
	d3.text('data/' + x.value + '.ini', function(d) {
		var data = d.split("\n");

		for (var j = 0; j < data.length; j++) {
			var s = data[j].split("=");
			if (s[0] === "Names") {
				var c = s[1].replace(/\r/g, "").split(",");
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
			if (s[0] === "DataTypes" && columns.length != 0) {
				var a = s[1].toLowerCase().split(",");
				for (var i = 0; i < a.length; i++) {
					a[i] = a[i].replace(/\r/g, "");
					if (a[i] === "int" || a[i] === "float") {
						optionsattr.push({ name: columns[i], type: 1 });
					}
					else {
						optionsattr.push({ name: columns[i], type: 0 });
					}
				}
			}
		}
		if (attributes.length == 0) {
			attributes = columns;
		}
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
	drawChart(attr[0], attr[0], "1", $('#dataset').val());
	drawChart(attr[0], attr[0], "2", $('#dataset').val());
}

/**
* This function handles redrawing the chart every time that a new option/axis is selected for one of the charts.
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

	drawChart(opt, opt2, num, $('#dataset').val(), null, null);

}

/**
* Given two variables (contained in axis1 and axis2), the name of the file, the possible
* restraint from the filter, and type of restraint (brush vs filter), this function decides
* what chart to draw based on whether the variables are the same and whether or not the 
* variables are numeric.
*/

function drawChart(axis1, axis2, chart, file, restraint, type) {
	var num = chart;
	var xvar = axis1;
	var yvar = axis2;
	$("#innerchart" + num).empty();
	if (restraint == null) {
		d3.csv('data/' + file + '.csv', function(d) {
			if (getType(xvar)) {
				d[xvar] = +d[xvar];
			}
			if (getType(yvar)) {
				d[yvar] = +d[yvar];
			}
			return d;
		}, function(data) {

			if (xvar == yvar) {
				heatmap(xvar, yvar, data, num);
			}
			else {
				if (getType(xvar) && getType(yvar)) { 
					scatterplot(xvar, yvar, data, num);
				}
				else if (!getType(xvar) && getType(yvar)) {
					stackedbarChart(xvar, yvar, data, num);
				}
				else {
					heatmap(xvar, yvar, data, num);
				}
			}
		});
	}
	else {
		d3.csv('data/' + file + '.csv', function(d) {
			if (getType(xvar)) {
				d[xvar] = +d[xvar];
			}
			if (getType(yvar)) {
				d[yvar] = +d[yvar];
			}

			if (type === "filter") {
				if (eval("d." + restraint)) {
					return d;
				}
			}

			return undefined;
		}, function(data) {
			if (xvar == yvar) {
				heatmap(xvar, yvar, data, num);
			}
			else {
				if (getType(xvar) && getType(yvar)) { 
					scatterplot(xvar, yvar, data, num);
				}
				else if (!getType(xvar) && getType(yvar)) {
					stackedbarChart(xvar, yvar, data, num);
				}
				else {
					heatmap(xvar, yvar, data, num);
				}
			}
		});
	}

}

/**
* This is the function that gets called when a filter is entered into the box.
*/

function restrainfilterChart(x) {
	var num = $(x).val();
	var xvar = $("#xaxis" + num).val();
	var yvar = $("#yaxis" + num).val();
	var restraint = $("#filter" + num).val();
	drawChart(xvar, yvar, num, $('#dataset').val(), restraint, "filter");
	$("#filter" + num).val("");

}

/**
* This is the function that gets called when a brush is entered into the box.
*/

function brushChart(x) {
	var num = $(x).val();
	var xvar = $("#xaxis" + num).val();
	var yvar = $("#yaxis" + num).val();
	var restraint = $("#brush" + num).val();
	drawChart(xvar, yvar, num, $('#dataset').val(), restraint, "brush");
	$("#brush" + num).val("");
}

