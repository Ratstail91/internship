import d3 from './d3.v3.js';

//PARAM: node = the <div> element to contain the svg
//PARAM: w = width of the bar graph
//PARAM: h = height of the bar graph
//PARAM: padding = structure containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//  bar = space between bars
//PARAM: titles = structure containing elements
//  x = name of the xAxis
//  y = name of the yAxis
//PARAM: dataset = array of structures passed to updateBarGraph():
//  value = the value to be drawn
//  label = the label to be drawn
//  active = whether the bar is active or not
//  mouseOver (optional) = called when a mouseOver event occurs, takes id as a parameter
//  mouseOut (optional) = called when a mouseOut event occurs, takes id as a parameter
//  id (optional) = passed to mouseOver and mouseOut
//PARAM: colors = an array of colors to be used:
//  [0]: below average, normal
//  [1]: above average, normal
//  [2]: below average, active
//  [3]: above average, active
function drawBarGraph(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0, bar: 1}, titles = {x: '', y: ''}, dataset = [], colors = []) {
  //constants
  var titlePadding  = 12;

  //do the stuff
  var svg = d3.select(node).append("svg")
    .attr("width", w + padding.left + padding.right + titlePadding)
    .attr("height", h + padding.top + padding.bottom + titlePadding)
    .attr("padding", JSON.stringify(padding))
    .attr("titles", JSON.stringify(titles))
    .attr("colors", JSON.stringify(colors))
    .append("g");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "bars");
  svg.append("g").attr("class", "tooltips");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "axis");
  svg.append("g").attr("class", "dashline");
  svg.append("g").attr("class", "titles");
  svg.append("g").attr("class", "xaxis")

  //draw the titles (x & y)
  if (titles != null && titles.x !== '') {
    //x title
    var xTitleSelector = svg.select(".titles")
      .selectAll("x-title")
      .data([titles.x]);

    xTitleSelector
      .enter()
      .append("text")
      .text(function(d) { return d; })
      .attr("class", "x-title")
      .attr("x", function(d) { return padding.left + (w/2); } )
      .attr("y", function(d) { return padding.top + h; } )
      .attr("dy", "2em")
      .attr("text-anchor", "middle");

    xTitleSelector
      .attr("fill", "black")
      .attr("display", "inline")
      .attr("font-size", 12)
      .attr("font-family", "sans-serif");

    xTitleSelector
      .exit()
      .remove();
  }
  else {
    svg.select(".titles").selectAll(".x-title").remove();
  }


  if (titles != null && titles.y !== '') {
    //y title
    var yTitleSelector = svg.select(".titles")
      .selectAll("y-title")
      .data([titles.y]);

    yTitleSelector
      .enter()
      .append("text")
      .text(function(d) { return d; })
      .attr("class", "y-title")
      .attr("x", function(d) { return -padding.top - (h/2); } )
      .attr("y", function(d) { return 0; } )
      .attr("dy", titlePadding)
      .attr("text-anchor", "middle");

    yTitleSelector
      .attr("fill", "black")
      .attr("display", "inline")
      .attr("font-size", 12)
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(270)");

    yTitleSelector
      .exit()
      .remove();
  }
  else {
    svg.select(".titles").selectAll(".y-title").remove();
  }

  //draw the X-axis line
  var xAxis = svg.select(".xaxis")
    .selectAll("line")
    .data([[0, h, w, h]]);

  xAxis
    .enter()
    .append("line");

  xAxis
    .attr("x1", (d) => { return padding.left + titlePadding + d[0]; })
    .attr("y1", (d) => { return padding.top + d[1]; })
    .attr("x2", (d) => { return padding.left + titlePadding + d[2]; })
    .attr("y2", (d) => { return padding.top + d[3]; })
    .style("stroke", "black")
    .style("stroke-width", "2");

  xAxis
    .exit()
    .remove();

  return updateBarGraph(node, dataset, 1000);
}

//PARAM: node = the <div> element that contains the svg created by drawBarGraph
//PARAM: dataset = array of structures containing data to draw:
//  value = the value to be drawn
//  label = the label to be drawn
//  active = whether the bar is active or not
//  mouseOver (optional) = called when a mouseOver event occurs, takes id as a parameter
//  mouseOut (optional) = called when a mouseOut event occurs, takes id as a parameter
//  id (optional) = passed to mouseOver and mouseOut
//PARAM: duration = time that the transition should take
function updateBarGraph(node, dataset, duration = 1000) {
  //constants
  var titlePadding = 12;

  //get the SVG
  var svg = d3.select(node).select("svg");

  //get width, height and padding
  var padding = JSON.parse(svg.attr("padding"));

  var w = svg.attr("width") - padding.left - padding.right - titlePadding;
  var h = svg.attr("height") - padding.top - padding.bottom - titlePadding;

  //get the other metadata
  var colors = JSON.parse(svg.attr("colors"));

  //get the average
  var average = 0;

  if(dataset.length != 0) {
    average = dataset.reduce(function(a, b) { return a+b.value; }, 0) / dataset.length;
  }

  //calc the scale
  var max = 0;
  dataset.map(function(x) { max = max > x.value ? max : x.value; });

  //check for an empty set
  if (typeof(max) !== 'number' || max === 0) {
    return;
  }

  var yScale = d3.scale.linear()
    .domain([0, max])
    .range([h, 1]);

  //initialize the tooltips
  var tooltips = svg.select(".tooltips")
    .selectAll("text")
    .data(dataset);

  //create new tooltips
  tooltips
    .enter()
    .append("text")
    .attr("class", "tips");

  //static attributes that all tooltips need
  tooltips
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w/dataset.length) + (w/dataset.length - padding.bar) / 2; })
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .text(function(d) { return d.value; })
    .attr("fill", "white")
    .attr("display", function(d) { return d.active ? "inline" : "none"; })
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  //move the tooltips into place
  tooltips
    .transition()
    .duration(duration)
    .attr("y", function(d, i) {
      return padding.top + yScale(d.value);
    });

  //remove the unneeded tooltips
  tooltips
    .exit()
    .remove();

  //initialize the bars
  var bars = svg.select(".bars")
    .selectAll("rect")
    .data(dataset);

  //create new bars
  bars
    .enter()
    .append("rect")
    .attr("class", "bar");

  //static components that all bars need
  bars
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w / dataset.length); })
    .attr("width", w / dataset.length -padding.bar)

  //hover
  bars
    .on("mouseover", function(d, i) { if (d.mouseOver) d.mouseOver(d.id); })
    .on("mouseout", function(d, i) { if (d.mouseOut) d.mouseOut(d.id); });

  //bars changing value
  bars
    .transition()
    .duration(duration)
    .attr("y", function(d, i) {
      return padding.top + yScale(d.value);
    })
    .attr("height", function(d, i) {
      return h - yScale(d.value);
    })
    .style("fill", function(d, i) {
      if (d.active) {
        return colors[d.value < average ? 2:3];
      }
      else {
        return colors[d.value < average ? 0:1];
      }
    })

  //remove the unneeded bars
  bars
    .exit()
    .remove();

  //initialize the labels
  var labels = svg.select(".labels")
    .selectAll("text")
    .data(dataset);

  //create new labels
  labels
    .enter()
    .append("text")
    .attr("class", "label");

  //static components that every label needs
  labels
    .text(function(d) { return d.label; })
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w/dataset.length) + (w/dataset.length -padding.bar) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", function(d, i) { return padding.top + h; })
      .attr("dy", "1em")
    .attr("fill", "black")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  //remove unneeded labels
  labels
    .exit()
    .remove();

  //draw the fancy axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var axis = svg.select(".axis")
    .attr("transform", "translate(" + (padding.left + titlePadding) + "," + padding.top + ")")
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
    .attr("x1", padding.left + titlePadding)
    .attr("y1", function(d) { return padding.top + yScale(d); })
    .attr("x2", padding.left  + titlePadding + w)
    .attr("y2", function(d) { return padding.top + yScale(d); })

  dashline
    .style("stroke-width", "2")
    .style("stroke", "black")
    .attr("stroke-dasharray", "5,5");

  dashline
    .transition()
    .duration(duration)
    .attr("y1", function(d, i) {
      return padding.top + yScale(d);
    })
    .attr("y2", function(d, i) {
      return padding.top + yScale(d);
    });

  dashline
    .exit()
    .remove();

  return svg;
}

export { drawBarGraph, updateBarGraph };
