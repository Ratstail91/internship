//DOCS: pie_graph.js
//
//There are two functions in this file, which utilize d3 to draw a pie graph.
//First, before calling either, you must ensure that there is a <div> object
//with an ID somewhere in your project; this will be the container for the pie
//graph.
//
//  function drawPieGraph(id, w, h, padding,
//    dataset = [], labels = [], colors = [])
//
//drawPieGraph() creates a static SVG image of the pie graph, derived from the
//given input. ‘id’ is the unique ID of the <div> object, w and h are simply
//the width and height of the image canvas to create. Padding is a structure 
//indicating how much empty space to insert along each edge of the SVG, with
//separate fields for the top, left, right and bottom edges.
//
//‘dataset’ is the array of integers representing different sectors (or
//“slices”) of the graph. ‘labels’ is an array of strings containing each
//sector’s label. Finally, ‘color’ is an array of color codes (i.e. #FF0000;
//other formats may work, but are unsupported) for each sector. If there are
//fewer colors than sectors, the system will simply reuse colors.
//
//This function is designed to render static pie graphs, however it can be used
//in conjunction with the following.
//
//  updatePieGraph(id, dataset = [], labels = [], colors = [], duration = 1000)
//
//This function is designed to act on a pie graph that was created by
//drawPieGraph() (above). ‘id’ is the ID of the <div> element holding the SVG.
//‘dataset’ is the new data to be displayed, while ‘labels’ are their
//corresponding labels. Finally, ‘colors’ must also be passed and, as above, if
//there are fewer colors than sectors, colors will be reused. 
//
//There is an extra parameter here, “duration”. This allows you to set, in
//milliseconds, the amount of time the transition between the previous graph
//state and the new one should take. This transition is animated thanks to the
//power of d3, but as I said, updatePieGraph() can ONLY act on pie graphs
//created by drawPieGraph(), it can’t create it’s own.

//-----------------------------------------------------------------------------

//PARAM: id = the ID of a <div> element
//PARAM: w = width of the pie graph
//PARAM: h = height of the pie graph
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
function drawPieGraph(id, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, dataset = [], labels = [], colors = []) {
  //calc radius
  r = Math.min(w, h) /2;

  //create the SVG object
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding-top", padding.top)
    .attr("padding-left", padding.left)
    .attr("padding-right", padding.right)
    .attr("padding-bottom", padding.bottom)
    .append("g")
    //move the origin to the center of the image
    .attr("transform", "translate(" + (padding.left + (w / 2)) + "," + (padding.top + (h / 2)) + ")");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "lines");

  //call the lower part of this process
  updatePieGraph(id, dataset, labels, colors, 1000);

  return svg;
}

//PARAM: id = the ID of a <div> element
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
//PARAM: duration = time in ms update transition takes
function updatePieGraph(id, dataset = [], labels = [], colors = [], duration = 1000) {
  var svg = d3.select("#" + id).select("svg");

  //get width, height and padding
  var padding = {
    top: Number(svg.attr("padding-top")),
    left: Number(svg.attr("padding-left")),
    right: Number(svg.attr("padding-right")),
    bottom: Number(svg.attr("padding-bottom"))
  }
  var w = svg.attr("width") - padding.left - padding.right;
  var h = svg.attr("height") - padding.top - padding.bottom;
  var r = Math.min(w, h) /2;

  //utilities
  colorOrdinal = d3.scale.ordinal().range([...colors]);

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

  var outerArc = d3.svg.arc()
    .innerRadius(r)
    .outerRadius(r * 1.1);

  var pie = d3.layout.pie()
    .value((d) => { return d; })
    .sort(null);

  //adjust the slices
  var slices = svg.select(".slices")
    .selectAll("path.slice")
    .data(pie(dataset));

  slices
    .enter()
    .append("path")
    .attr("fill", (d, i) => { return colorOrdinal(i); })
    .attr("class", "slice")

  slices
    .transition()
    .duration(duration)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      }
    });

  slices
    .exit()
    .remove();

  //adjust text labels
  function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

  labels = svg.select(".labels")
    .selectAll("text")
    .data(labels);

  labels
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .attr("font-size", "14px")
    .style("fill", function(d, i) { return colorOrdinal(i); })
    .text(function(d) { return d; });

  labels
    .transition()
    .duration(duration)
    .attrTween("transform", function(d, i) {
      //store the derivation of the dataset instead
      newD = pie(dataset)[i];
      this._current = this._current || newD;
      var interpolate = d3.interpolate(this._current, newD);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var outerCenter = outerArc.centroid(d2);
        var shift = midAngle(d2) < Math.PI ? (w/2) : (-w/2);
        return "translate(" + [shift, outerCenter[1]] + ")";
      };
    })
    .styleTween("text-anchor", function(d, i) {
      //store the derivation of the dataset instead
      newD = pie(dataset)[i];
      this._current = this._current || newD;
      var interpolate = d3.interpolate(this._current, newD);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start" : "end";
      }
    });

  labels
    .exit()
    .remove();

  //adjust the polylines
  var lines = svg.select(".lines")
    .selectAll("polyline")
    .data(pie(dataset));

  lines
    .enter()
    .append("polyline")
    .attr("opacity", "1")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .attr("fill", "none");

  lines
    .transition()
    .duration(duration)
    .attrTween("points", function(d, i) {
      //store the derivation of the dataset instead
      newD = pie(dataset)[i];
      this._current = this._current || newD;
      var interpolate = d3.interpolate(this._current, newD);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = arc.centroid(d2);
        var outerPos = outerArc.centroid(d2);
        shift = midAngle(d2) < Math.PI ? (w/2) : (-w/2);
        return "" + pos + " " + outerPos + " " + [shift, outerPos[1]];
      } 
    });

  lines
    .exit()
    .remove();

  return svg;
}
