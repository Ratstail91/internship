//PARAM: id = the ID of a <div> element
//PARAM: w = width of the resulting SVG
//PARAM: h = height of the resulting SVG
//PARAM: r = radius of the graph, normally Math.min(w, h) /2
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
function drawPieGraph(id, w, h, r, dataset, labels, colors) {
  //reformat the arguments
  if (r == -1) {
    r = Math.min(w, h) /2;
  }

  //utilities
  colorOrdinal = d3.scale.ordinal().range([...colors]);

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

  var outerArc = d3.svg.arc()
    .innerRadius(r)
    .outerRadius(r*1.1);

  var pie = d3.layout.pie()
    .value((d) => { return d; })
    .sort(null);


  //do the stuff
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    //move the origin to the center of the image
    .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "lines");

  //fill the slices with a color
  svg.select(".slices").selectAll("path.slice")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => { return colorOrdinal(i); })
    .attr("class", "slice");

  //add text labels
  function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

  svg.select(".labels").selectAll("text")
    .data(labels)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .text(function(d) { return d; })
    .attr("transform", function(d, i) {
      var outerCenter = outerArc.centroid(pie(dataset)[i]);
      var shift = midAngle(pie(dataset)[i]) < Math.PI ? (w/2) : (-w/2);
      return "translate(" + [shift, outerCenter[1]] + ")"; 
    })
    .style("text-anchor", function(d, i) {
      return midAngle(pie(dataset)[i]) < Math.PI ? "start" : "end";
    });

  //add slice to text polylines
  svg.select(".lines").selectAll("polyline")
    .data(pie(dataset))
    .enter()
    .append("polyline")
    .attr("opacity", ".3")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .attr("fill", "none")
    .attr("points", function(d, i) {
      var pos = arc.centroid(d);
      var outerPos = outerArc.centroid(d);
      var shift = midAngle(pie(dataset)[i]) < Math.PI ? (w/2) : (-w/2);
      return "" + pos + " " + outerPos + " " + [shift, outerPos[1]];
    });
}
