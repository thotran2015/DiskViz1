var margin = 20,
		padding = 2,
		diameter = 650,
		root = flareData();

var color = d3.scale.linear()
		.domain([0, depthCount(root)])
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
		.padding(padding)
		.size([diameter, diameter])
		.value(function(d) {
				//return d.size;
			return 100;
		}),
		arc = d3.svg.arc().innerRadius(0),
		pie = d3.layout.pie;

var tooltip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")

var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.append("g")
		.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var focus = root,
		nodes = pack.nodes(root),
		//nodes = svg.selectAll("g.node")
		//.data(pack.nodes(root)),
		view;


var circle = svg.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("class", function(d) {
				return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
		})
		.style("fill", function(d) {
				return d.children ? color(d.depth) : null;
		})
		.on("click", function(d) {
				if (focus !== d) zoom(d), d3.event.stopPropagation();
				return tooltip.style("visibility", "hidden");
		})
		.on("mouseover", function(d){
			return tooltip.html(d.name+ "<br/>" + d.tooltip).style("visibility", "visible");
		})
		.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
		.on("mouseout", function(){
				return tooltip.style("visibility", "hidden");
			});


// Define the div for the tooltip
// var div = d3.select("body").append("div")
// 		    .attr("class", "tooltip")
// 		    .style("opacity", 0);

/*
nodes.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
		});

var arcGs = nodes.selectAll("g.arc")
		.data(function(d) {
				return pie(d[1]).map(function(m) {
						m.r = d.r;
						return m;
				});
		});
var arcEnter = arcGs.enter().append("g").attr("class", "arc");

arcEnter.append("path")
		.attr("d", function(d) {
				arc.outerRadius(d.r);
				return arc(d);
		})
		.style("fill", function(d, i) {
				return color(i);
		});
*/
/*---------------------------------------------------------------*/

var text = svg.selectAll("text")
		.data(nodes)
		.enter().append("text")
		.attr("class", "label")
		.style("fill-opacity", function(d) {
				return d.parent === root ? 1 : 0;
		})
		.style("display", function(d) {
				return d.parent === root ? null : "none";
		})
		.text(function(d) {
				return d.name;
		});

var node = svg.selectAll("circle,text");

d3.select("body")
		.on("click", function() {
				zoom(root);
		});

zoomTo([root.x, root.y, root.r * 2 + margin]);

function zoom(d) {
		var focus0 = focus;
		focus = d;

		var transition = d3.transition()
				.duration(d3.event.altKey ? 7500 : 750)
				.tween("zoom", function(d) {
						var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
						return function(t) {
								zoomTo(i(t));
						};
				});

		transition.selectAll("text")
				.filter(function(d) {
						return d.parent === focus || this.style.display === "inline";
				})
				.style("fill-opacity", function(d) {
						return d.parent === focus ? 1 : 0;
				})
				.each("start", function(d) {
						if (d.parent === focus) this.style.display = "inline";
				})
				.each("end", function(d) {
						if (d.parent !== focus) this.style.display = "none";
				});
}

function zoomTo(v) {
		var k = diameter / v[2];
		view = v;
		node.attr("transform", function(d) {
				return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
		});
		circle.attr("r", function(d) {
				return d.r * k;
		});
}

function hovered(hover) {
	return function(d) {
		d3.selectAll(d.ancestors().map(function(d) {}));
	};
}

/**
 * Counts JSON graph depth
 * @param {object} branch
 * @return {Number} object graph depth
 */
function depthCount(branch) {
		if (!branch.children) {
				return 1;
		}
		return 1 + d3.max(branch.children.map(depthCount));
}

d3.select(self.frameElement).style("height", diameter + "px");

/*********************************************************************/

function flareData() {
		return {
				"name": "flare",
				"children": [{
						"name": "RAID H",
						"tooltip": "Level: HP",
						"children": [{
								"name": "Group A",
								"tooltip": "Drive #: 5",
								"children": [{
										"name": "Disk A1",
										"tooltip": "name: A1",
										"children": [{
												"name": "40KB, spare",
												"size": 35
										}]
								}, {
										"name": "Disk A2",
										"tooltip": "Type: HHD",
										"children": [{
												"name": "40KB, spare",
												"size": 35
										}]
								}, {
										"name": "Disk A3",
										"tooltip": "Type: SSD",
										"children": [{
												"name": "40KB, spare",
												"size": 35
										}]
								}, {
										"name": "Disk A4",
										"tooltip": "Type: SSD",
										"children": [{
												"name": "40KB, spare",
												"size": 35
										}]
								}]
						}, {
								"name": "Group B",
								"tooltip": "Drive #: 10",
								"children": [{
										"name": "Disk B1",
										"tooltip": "Type: SSD",
										"children": [{
												"name": "40KB, spare",
												"size": 35
										}]
								}, {
										"name": "Disk B2",
										"tooltip": "Type: HHD",
										"children": [{
												"name": "30KB, spare",
												"size": 35
										}]
								}, {
										"name": "Disk B3",
										"tooltip": "Type: SSD",
										"children": [{
												"name": "40KB, spare",
												"size": 78
										}]

								}, {
										"name": "Disk B4",
										"tooltip": "Type: SATA",
										"children": [{
												"name": "40KB, spare",
												"size": 59
										}]
								}, {
										"name": "ID: 0b.01.0",
										"tooltip": "Type: SAS",
										"children": [{
												"name": "40KB, spare",
												"size": 34
										}]
								}]
						}, {
								"name": "ID: 0b.01.1",
								"tooltip": "Type: SSD",
								"children": [{
										"name": "40KB, spare",
										"size": 70
								}]
						}]
				}]

		}
}
