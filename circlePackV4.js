var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var container = svg.append('g');

var focus, fColor, fB = false;

var tooltip = d3.select("#tooltip"),
    nc = d3.select("#nc"),
    ns = d3.select("#ns"),
    nf = d3.select("#nf"),
    no = d3.select("#no");

var zoom = d3.zoom()
  .scaleExtent([0.2, 4])
  .on("zoom", zoomed);

var color = d3.scaleLinear()
    .domain([0, 3])
    .range(["hsl(228,30%,40%)","hsl(152,80%,80%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([width - 2, height - 2])
    .padding(30);

var defs = svg.append('svg:defs');

d3.json("https://api.myjson.com/bins/1rxct", function(error, data) {
  if (error) throw error;
  var root = d3.hierarchy(data)
    .sum(function (d){
      return d.children? 0 : 1;
    });

  pack(root);

  var node = container.selectAll("g")
    .data(root.descendants())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
      .each(function(d) { d.node = this; })
      .on("mouseover", hovered(true))
      .on("mouseout", hovered(false))
      .on("click", transZoom());


  node.append("circle")
      .attr("id", function(d) { return "node-" + d.data.index; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.depth); });
      //.style("fill", "url(https://i.imgur.com/elito1b.jpg)");

  node.append("title")
      .text(function(d) {
        return d.data.rank+": "+d.data.name;
      });
});


function hovered(hover) {
  return function(d) {
    if (d.depth == 3 && hover){
      tooltip.style('opacity','1');
      nc.text(d.data.common_name);
      ns.text(d.data.name);
      nf.text(d.parent.data.name);
      no.text(d.parent.parent.data.name);
    }else {
      tooltip.style('opacity','0');
    }
    d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
  };
}

function zoomed(){
  container
    .transition()
    .duration(700)
    .attr("transform", d3.event.transform);
}

function transZoom(){
  return function(d){
    if (d.depth >= 2){
      if (fB){
        d3.select(focus).style('fill',fColor);
      }
      fB = true;
      focus = this.firstChild;
      fColor = color(d.depth);

      d3.select(this.firstChild)
        .style("fill", d3.color(color(d.depth)).darker(2));
    }

    d3.select(this)
      .call(zoom.transform, transform(d));
  };
}

function transform(data){
  var scale = data.depth ? data.depth*1.4 : 1;
  return d3.zoomIdentity
    .translate(width/2,height/2)
    .scale(scale)
    .translate(-data.x,-data.y);
}
