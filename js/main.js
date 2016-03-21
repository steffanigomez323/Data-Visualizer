$(document).ready(function() {
	$('#dataset').val("cars").trigger('change');
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
		console.log(columns); // sanity check
		console.log(attributes); // sanity check
		drawChart(columns, attributes, x);
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

function drawChart(col, attr, x) {

	createAxisOptions(attr);

	d3.csv('data/' + x.value + '.csv', function(d) {
		console.log(d);
	});

}