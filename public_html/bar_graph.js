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
  //utilities
  var colorOrdinal = d3.scale.ordinal().range([...colors]);
  var max = Math.max(...dataset);
  var average = dataset.length ? dataset.reduce(function(a, b) { return a+b; }) / dataset.length : 0;

  var yScale = d3.scale.linear()
    .domain([0, max])
    .range([h, 1]);

  //do the stuff
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .append("g");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "bars");
  svg.append("g").attr("class", "tooltips");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "axis");
  svg.append("g").attr("class", "dashline");

  //create the tooltips
  tooltips = svg.select(".tooltips").selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("class", "tips")
    .attr("x", function(d, i) { return padding.left + i * (w/dataset.length) + (w/dataset.length - barPadding) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", function(d, i) { return padding.top + yScale(d); })
      .attr("dy", "1em")
    .attr("fill", "white")
    .attr("display", "none")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  //create the bars
  svg.select(".bars").selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return padding.left + i * (w / dataset.length); })
    .attr("y", function(d, i) { return padding.top + yScale(d); })
    .attr("width", w / dataset.length -barPadding)
    .attr("height", function(d) { return h - yScale(d); })
    .attr("fill", (d) => { return colorOrdinal(d < average); })
    .on("mouseover", (d, i) => {tooltips.style("display", (e, j) => {return i==j ? "inline":"none";}); })
    .on("mouseout", (d, i) => { tooltips.style("display", "none"); });

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

  svg.select(".axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .style("fill", "none")
    .style("stroke", "black")
    .style("shape-rendering", "crispEdges")
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .call(yAxis);

  //draw the average line
  svg.select(".dashline").selectAll("line")
    .data([average])
    .enter()
    .append("line")
    .attr("x1", padding.left)
    .attr("y1", function(d) { return padding.top + yScale(d); })
    .attr("x2", padding.left + w)
    .attr("y2", function(d) { return padding.top + yScale(d); })
    .style("stroke-width", "2")
    .style("stroke", "black")
    .attr("stroke-dasharray", "5,5");

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
