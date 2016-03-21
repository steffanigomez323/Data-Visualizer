$(document).ready(function() {

});

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
		console.log(columns);
		console.log(attributes);
		drawChart(columns, attributes, x);
	});
}

function drawChart(col, attr, x) {
	d3.csv('data/' + x.value + '.csv', function(d) {
		console.log(d);
	});

	d3.csv('data/city_distances.csv', function(d) {
		console.log(d);
	});
}