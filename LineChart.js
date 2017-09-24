window.onload = function() {

	var LineChart = (function(d3) {

		// === Global variables ===
		var title,
			type,
			datum,
			interpolate,
			showGrid,
			showAxis;

		// === Initializing data ===
		function init(data) {
			title = data.title;
			type = data.type;
			datum = data.datum;
			interpolate = data.interpolate;
			showGrid = data.showGrid;
			showAxis = data.showAxis;
		}

		// === Check for axes drawing ===
		function checkShowAxes(svg, h, m, x, y) {
			if (showAxis.x) {
				svg.append('g')
				 	.attr('class', 'x-axis')
				 	.attr('transform', 'translate(' + m + ', ' + (h - m) + ')')
				 	.call(x);
			}

			if (showAxis.y) {
				svg.append('g')
				 	.attr('class', 'y-axis')
				 	.attr('transform', 'translate('+ m +', '+ m +')')
				 	.call(y);
			}
		}

		// === Linear graph drawing function ===
		function drawLineGraph() {

			// BOILERPLATE
			var height = 500,
				width = 500,
				margin = 30;

			// SVG Container 
			var svg = d3.select('body')
						.append('svg')
						.attr('class', 'axis')
						.attr('width', width)
						.attr('height', height);

			// X-axis length
			var xAxisLength = width - 2 * margin;

			// Y-axis length
			var yAxisLength = height - 2 * margin;

			// SCALE
			var scaleX = d3.scale.linear()
			 			.domain([0, d3.max(datum[0].values, d => {
			 				return d.x;
			 			})])
			 			.range([0, xAxisLength]);

			var scaleY = d3.scale.linear()
			 			.domain([0, d3.max(datum[0].values, d => {
			 				return d.y;
			 			})])
			 			.range([yAxisLength, 0]);

			// AXES
			var xGrid = (showGrid.x) ? -yAxisLength : null;
			var xAxis = d3.svg.axis()
			 			.scale(scaleX)
			 			.orient('bottom')
			 			.innerTickSize(xGrid)
			 			.tickPadding(10);

			var yGrid = (showGrid.y) ? -xAxisLength : null;
			var yAxis = d3.svg.axis()
			 			.scale(scaleY)
			 			.orient('left')
			 			.innerTickSize(yGrid)
			 			.tickPadding(10);

			// Drawing axes
			checkShowAxes(svg, height, margin, xAxis, yAxis);

			// VIZUALIZATION
			var smoothingLine = (interpolate) ? 'basis' : 'linear';
			var line = d3.svg.line()
						.interpolate(smoothingLine)
			 			.x(d => {
			 				return scaleX(d.x) + margin;
			 			})
			 			.y(d => {
			 				return scaleY(d.y) + margin;
			 			});

			// PATH
			svg.append('g').append('path')
			 				.attr('d', line(datum[0].values))
			 				.style('stroke', datum[0].color)
			 				.style('stroke-width', 2);

			return svg;

		}

		// === Overlay graph drawing function ===
		function drawOverlayGraph() {

			// BOILERPLATE
			var height = 500,
				width = 500,
				margin = 30;

			// X-axis length
			var xAxisLength = width - 2 * margin;

			// Y-axis length
			var yAxisLength = height - 2 * margin;

			// SVG Container 
			var svg = d3.select('body')
						.append('svg')
						.attr('class', 'axis')
						.attr('width', width)
						.attr('height', height);

			// SCALE
			var scaleX = d3.scale.linear()
			 			.domain([0, d3.max(datum[0].values, d => {
			 				return d.x;
			 			})])
			 			.range([0, xAxisLength]);

			var scaleY = d3.scale.linear()
			 			.domain([0, d3.max(datum[0].values, d => {
			 				return d.y;
			 			})])
			 			.range([yAxisLength, 0]);

			// AXES
			var xGrid = (showGrid.x) ? -yAxisLength : null;
			var xAxis = d3.svg.axis()
			 			.scale(scaleX)
			 			.orient('bottom')
			 			.innerTickSize(xGrid)
			 			.tickPadding(10);

			var yGrid = (showGrid.y) ? -xAxisLength : null;
			var yAxis = d3.svg.axis()
			 			.scale(scaleY)
			 			.orient('left')
			 			.innerTickSize(yGrid)
			 			.tickPadding(10);

    		// Drawing axes
			checkShowAxes(svg, height, margin, xAxis, yAxis);

    		// === VIZUALIZATION ===
    		var smoothingLine = (interpolate) ? 'basis' : 'linear';
    		var line = d3.svg.line()
    			.interpolate(smoothingLine)
    			.x(d => {
    				return scaleX(d.x) + margin;
    			})
    			.y(d => {
    				return scaleY(d.y) + margin;
    			});

    		var area = d3.svg.area()
    			.interpolate(smoothingLine)
    			.x(d => {
    				return scaleX(d.x) + margin;
    			})
    			.y0(d => {
    				return scaleY(d.y0) + margin;
    			})
    			.y1(d => {
    				return scaleY(d.y1) + margin;
    			})

    		var g = svg.append('g');
    		g.append('path')
    			.attr('d', area(datum[1].values))
    			.style("fill", datum[1].color);
    		g.append('path')
    			.attr('d', line(datum[0].values))
    			.attr('class', 'line')
    			.attr('stroke', datum[0].color)
    			.attr('stroke-width', 2);

    		return svg;

		}

		// === Overview graph drawing function ===
		function drawOverviewGraph() {

			// BOILERPLATE
			var height = 500,
				width = 500,
				margin = 30;

			// X-axis length
			var xAxisLength = width - 2 * margin;

			// Y-axis length
			var yAxisLength = height - 2 * margin;

			// SVG Container 
			var svg = d3.select('body')
						.append('svg')
						.attr('class', 'axis')
						.attr('width', width)
						.attr('height', height);

			var maxValue = d3.max([d3.max(datum[0].values, (d) => { return d.y; }),
								d3.max(datum[1].values, (d) => { return d.y; })]);

			var minValue = d3.min([d3.min(datum[0].values, (d) => { return d.y; }),
								d3.min(datum[1].values, (d) => { return d.y; })]);

			// SCALE
			var scaleX = d3.scale.linear()
			 			.domain([0, d3.max(datum[0].values, d => {
			 				return d.x;
			 			})])
			 			.range([0, xAxisLength]);

			var scaleY = d3.scale.linear()
			 			.domain([maxValue, minValue])
			 			.range([0, yAxisLength]);

			// AXES
			var xGrid = (showGrid.x) ? -yAxisLength : null;
			var xAxis = d3.svg.axis()
			 			.scale(scaleX)
			 			.orient('bottom')
			 			.innerTickSize(xGrid)
			 			.tickPadding(10);

			var yGrid = (showGrid.y) ? -xAxisLength : null;
			var yAxis = d3.svg.axis()
			 			.scale(scaleY)
			 			.orient('left')
			 			.innerTickSize(yGrid)
			 			.tickPadding(10);

    		// Drawing axes
			checkShowAxes(svg, height, margin, xAxis, yAxis);

			// === VIZUALIZATION ===
			createOverview(datum[0].values, datum[0].color);
			createOverview(datum[1].values, datum[1].color);

			function createOverview(info, colorStroke) {
				var smoothingLine = (interpolate) ? 'basis' : 'linear';
				var line = d3.svg.line()
								.interpolate(smoothingLine)
								.x((d) => { return scaleX(d.x) + margin; })
								.y((d) => { return scaleY(d.y) + margin; });

				// === PATH ===
				var g = svg.append('g');
					g.append('path')
						.attr('d', line(info))
						.style('stroke', colorStroke);
			}

			return svg;

		}

		// === Distribution graph drawing function ===
		function drawDistributionGraph() {

			var data = [];

			getData();

			// BOILERPLATE
			var height = 500,
				width = 500,
				margin = 30;

			// X-axis length
			var xAxisLength = width - 2 * margin;

			// Y-axis length
			var yAxisLength = height - 2 * margin;

			// SVG Container 
			var svg = d3.select('body')
						.append('svg')
						.attr('class', 'axis')
						.attr('width', width)
						.attr('height', height);

			// === SCALE ===
			var scaleX = d3.scale.linear()
						.domain(d3.extent(data, d => {
							return d.q;
						}))
						.range([0, xAxisLength]);

			var scaleY = d3.scale.linear()
						.domain(d3.extent(data, d => {
							return d.p;
						}))
						.range([yAxisLength, 0]);

			// AXES
			var xGrid = (showGrid.x) ? -yAxisLength : null;
			var xAxis = d3.svg.axis()
			 			.scale(scaleX)
			 			.orient('bottom')
			 			.innerTickSize(xGrid)
			 			.tickPadding(10);

			var yGrid = (showGrid.y) ? -xAxisLength : null;
			var yAxis = d3.svg.axis()
			 			.scale(scaleY)
			 			.orient('left')
			 			.innerTickSize(yGrid)
			 			.tickPadding(10);

			// Drawing axes
			checkShowAxes(svg, height, margin, xAxis, yAxis);

			// === VIZUALIZATION ===
			var line = d3.svg.line()
						.x(d => { return scaleX(d.q) + margin; })
						.y(d => { return scaleY(d.p) + margin });

			// === PATH ===
			svg.append("path")
			      .datum(data)
			      .attr("class", "line")
			      .attr("d", line)
			      .style('fill', 'url(#gradient)');

			// Gradient
			var gradient = svg.append("defs")
				.append("linearGradient")
					.attr("id", "gradient")
					.attr("x1", "0%")
					.attr("y1", "0%")
					.attr("spreadMethod", "pad");

			gradient.append("stop")
					.attr("offset", "0%")
					.attr("stop-color", "teal")
					.attr("stop-opacity", 1);

			gradient.append("stop")
					.attr("offset", "49%")
					.attr("stop-color", "gold")
					.attr("stop-opacity", 1);

			gradient.append("stop")
					.attr("offset", "51%")
					.attr("stop-color", "gold")
					.attr("stop-opacity", 1);

			gradient.append("stop")
					.attr("offset", "100%")
					.attr("stop-color", "crimson")
					.attr("stop-opacity", 1);

			// === HELPER FUNCTIONS ===
			function getData() {
				for (var i = 0; i < 100000; i++) {
					q = normal();
					p = gaussian(q);
					el = {
						"q": q,
						"p": p
					}
					data.push(el)
				};

				data.sort((x, y) => {
					return x.q - y.q;
				});
			}

			function normal() {
			    var x = 0,
			        y = 0,
			        rds, c;
			    do {
			        x = Math.random() * 2 - 1;
			        y = Math.random() * 2 - 1;
			        rds = x * x + y * y;
			    } while (rds == 0 || rds > 1);
			    c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
			    return x * c; // throw away extra sample y * c
			}

			function gaussian(x) {
				var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
					mean = 0,
			    	sigma = 1;

			    x = (x - mean) / sigma;
			    return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
			};

			return svg;
		}

		return {

			// === Function of data drawing ===
			draw: function(data) {

				var svgObj;

				init(data);

				switch(type) {
					case 'line':
						svgObj = drawLineGraph();
						break;
					case 'overlay':
						svgObj = drawOverlayGraph();
						break;
					case 'overview':
						svgObj = drawOverviewGraph();
						break;
					case 'distribution':
						svgObj = drawDistributionGraph();
						break;
				}

				return svgObj;

			}

		}

	})(d3);

	var lineGraph = LineChart.draw({
	    title: 'Line Graph',
	    type: 'line',
	    datum: [
	        {
	            values: [
	                {x: 10, y: 67}, {x: 20, y: 74}, {x: 30, y: 63}, {x: 40, y: 56}, {x: 50, y: 24}
	            ],
	            key: '',
	            color: 'steelblue'
	        },
	    ],
	    interpolate: false,
	    showGrid: {x: true, y: true},
	    showAxis: {x: true, y: true}
	});

	var overlayGraph = LineChart.draw({
	    title: 'Overlay Graph',
	    type: 'overlay',
	    datum: [
	        {
	            values: [
	                {x: 0, y: 5}, {x: 1, y: 8}, {x: 2, y: 13}, {x: 3, y: 12}, {x: 4, y: 16}
	            ],
	            key: '',
	            color: '#000000'
	        },
	        {
	            values: [
	                // {x: , y0: , y1: }, ...
	                {x: 0, y0: 4, y1: 6}, {x: 1, y0: 7, y1: 9}, {x: 2, y0: 11, y1: 15}, {x: 3, y0: 10, y1: 14}, {x: 4, y0: 14, y1: 18}
	            ],
	            key: '',
	            color: 'lightblue'
	        },
	    ],
	    interpolate: true,
	    showGrid: {x: true, y: true},
	    showAxis: {x: true, y: true},
	});

	var overviewChart = LineChart.draw({
	    title: 'Overview Chart',
	    type: 'overview',
	    datum: [
	        {
	            values: [
	                {x: 10, y: 67}, {x: 20, y: 74}, {x: 30, y: 63}, {x: 40, y: 56}, {x: 50, y: 24}
	            ],
	            key: '',
	            color: 'steelblue'
	        },
	        {
	            values: [
	                {x: 8, y: 57}, {x: 23, y: 44}, {x: 28, y: 73}, {x: 34, y: 44}, {x: 37, y: 44}
	            ],
	            key: '',
	            color: '#ff7f0e'
	        },
	    ],
	    interpolate: true,
	    showGrid: {x: true, y: true},
	    showAxis: {x: true, y: true},
	});

	var distributionGraph = LineChart.draw({
	    title: 'Distribution Chart',
	    type: 'distribution',
	    datum: [
	        {
	            values: [
	                // {x: , y: }, ...
	            ],
	            key: '',
	            color: 'steelblue',
	            // selection could also be coordinates, {center: {x: 10}, width: 4}
	            selection: {
	                center: '85%',
	                width: '5%'
	            },
	            gradient: {
	                orientation: 'left',
	                stops: ['blue', '0%', 'green', '33%', 'yellow', '66%', 'red', '100%']
	            },
	        },
	    ],
	    interpolate: true,
	    showGrid: {x: true, y: true},
	    showAxis: {x: true , y: true},
	});

}