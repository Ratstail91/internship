//DOCS: bar_graph.js
//
//There are two functions in this file, which utilize d3 to draw a bar graph.
//First, before calling either, you must ensure that there is a <div> object
//with an ID somewhere in your project; this will be the container for the bar
//graph.
//
//  function drawBarGraph(id, w, h, padding, barPadding = 1,
//    dataset = [], labels = [], colors = [])
//
//drawBarGraph() creates a static SVG image of the bar graph, derived from the
//given input. ‘id’ is the unique ID of the <div> object, w and h are simply
//the width and height of the image canvas to create. Padding is a structure 
//indicating how much empty space to insert along each edge of the SVG, with
//separate fields for the top, left, right and bottom edges. barPadding
//indicates how much space should be between each bar.
//
//‘dataset’ is the array of integers representing different bars of the graph.
//‘labels’ is an array of strings containing each bar’s label. Finally, ‘color’
//is a array of color codes (i.e. #FF0000; other formats may work, but are
//unsupported). The first two colors are used to color bars that are below and
//above the average bar, respectively.
//
//This function is designed to render static bar graphs, however it can be used
//in conjunction with the following.
//
//  updateBarGraph(id, barPadding = -1,
//    dataset = [], labels = [], colors = [], duration = 1000)
//
//This function is designed to act on a bar graph that was created by
//drawBarGraph() (above). ‘id’ is the ID of the <div> element holding the SVG.
//'barPadding' is the amount of space to place between bars or -1 to leave as
//is. ‘dataset’ is the new data to be displayed, while ‘labels’ are their
//corresponding labels. Finally, ‘colors’ must also be passed and, as above,
//these are used to distinguish bars below or above the average.
//
//There is an extra parameter here, “duration”. This allows you to set, in
//milliseconds, the amount of time the transition between the previous graph
//state and the new one should take. This transition is animated thanks to the
//power of d3, but as I said, updateBarGraph() can ONLY act on bar graphs
//created by drawBarGraph(), it can’t create it’s own.

//BUGS:
//
//There is a graphical bug that occurs when adding to the tallest bar. This is
//because the entire graph must shrink before the animation takes place, so a
//jarring jump is present.

//-----------------------------------------------------------------------------

//PARAM: id = the ID of a <div> element
//PARAM: w = width of the bar graph
//PARAM: h = height of the bar graph
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: barPadding = space between bars
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = pair of colors to use
function drawBarGraph(id, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, barPadding = 1, dataset = [], labels = [], colors = []) {
  //do the stuff
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding-top", padding.top)
    .attr("padding-left", padding.left)
    .attr("padding-right", padding.right)
    .attr("padding-bottom", padding.bottom)
    .attr("bar-padding", barPadding)
    .append("g");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "bars");
  svg.append("g").attr("class", "tooltips");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "axis");
  svg.append("g").attr("class", "dashline");

  updateBarGraph(id, barPadding, dataset, labels, colors);

  return svg;
}

//PARAM: id = the ID of a <div> element
//PARAM: barPadding = space between bars
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = pair of colors to use
//PARAM: duration = time in ms update transition takes
function updateBarGraph(id, barPadding = -1, dataset = [], labels = [], colors = [], duration = 1000) {
  var svg = d3.select("#" + id).select("svg");

  //calc barpadding
  barPadding = barPadding == -1 ? Number(svg.attr("bar-padding")) : barPadding;

  //get width, height and padding
  var padding = {
    top: Number(svg.attr("padding-top")),
    left: Number(svg.attr("padding-left")),
    right: Number(svg.attr("padding-right")),
    bottom: Number(svg.attr("padding-bottom"))
  }

  var w = svg.attr("width") - padding.left - padding.right;
  var h = svg.attr("height") - padding.top - padding.bottom;

  //utilities
  var colorOrdinal = d3.scale.ordinal().range([...colors]);
  var max = Math.max(...dataset);
  var average;

  if(dataset.length != 0) {
    average = dataset.reduce(function(a, b) { return a+b; }) / dataset.length;
  }
  else {
    average = 0;
  }

  var yScale = d3.scale.linear()
    .domain([0, max])
    .range([h, 1]);

  //create the tooltips
  tooltips = svg.select(".tooltips")
    .selectAll("text")
    .data(dataset);

  tooltips
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("class", "tips")
    .attr("x", function(d, i) { return padding.left + i * (w/dataset.length) + (w/dataset.length - barPadding) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", function(d, i) { return padding.top + yScale(d); })
      .attr("dy", "1em");

  tooltips
    .attr("fill", "white")
    .attr("display", "none")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  tooltips
    .transition()
    .duration(duration)
    .attrTween("y", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    });

  tooltips
    .exit()
    .remove();

  //create the bars
  bars = svg.select(".bars")
    .selectAll("rect")
    .data(dataset);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return padding.left + i * (w / dataset.length); })
    .attr("y", function(d, i) { return padding.top + yScale(d); })
    .attr("width", w / dataset.length -barPadding)
    .attr("height", function(d) { return h - yScale(d); })
    .attr("fill", (d) => { return colorOrdinal(d < average); });

  bars
    .on("mouseover", (d, i) => {tooltips.style("display", (e, j) => {return i==j ? "inline":"none";}); })
    .on("mouseout", (d, i) => { tooltips.style("display", "none"); });

  bars
    .transition()
    .duration(duration)
    .attrTween("y", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    })
    .attrTween("height", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return h - yScale(interpolate(t));
      }
    })
    .attrTween("fill", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return colorOrdinal(interpolate(t) < average);
      }
    })

  bars
    .exit()
    .remove();

  //create and place the labels
  svg.select(".labels").selectAll("text")
    .data(labels)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return padding.left + i * (w/dataset.length) + (w/dataset.length -barPadding) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", function(d, i) { return padding.top + h; })
      .attr("dy", "1em")
    .attr("fill", "black")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  //draw the axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var axis = svg.select(".axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .style("fill", "none")
    .style("stroke", "black")
    .style("shape-rendering", "crispEdges")
    .style("font-family", "sans-serif")
    .style("font-size", "11px");

  axis
    .transition()
    .duration(duration)
    .call(yAxis);

  //draw the average line
  var dashline = svg.select(".dashline")
    .selectAll("line")
    .data([average]);

  dashline
    .enter()
    .append("line")
    .attr("x1", padding.left)
    .attr("y1", function(d) { return padding.top + yScale(d); })
    .attr("x2", padding.left + w)
    .attr("y2", function(d) { return padding.top + yScale(d); })

  dashline
    .style("stroke-width", "2")
    .style("stroke", "black")
    .attr("stroke-dasharray", "5,5");

  dashline
    .transition()
    .duration(duration)
    .attrTween("y1", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    })
    .attrTween("y2", function(d, i) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    });

  dashline
    .exit()
    .remove();

  //draw the X-axis line
  svg.append("g")
    .attr("class", "xaxis")
    .selectAll("line")
    .data([[0, h, w, h]])
    .enter()
    .append("line")
    .attr("x1", (d) => { return padding.left + d[0]; })
    .attr("y1", (d) => { return padding.top + d[1]; })
    .attr("x2", (d) => { return padding.left + d[2]; })
    .attr("y2", (d) => { return padding.top + d[3]; })
    .style("stroke", "black")
    .style("stroke-width", "2");

  return svg;
}
