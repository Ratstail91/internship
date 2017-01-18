//PARAM: id = the ID of a <div> element
//PARAM: w = width of the resulting SVG
//PARAM: h = height of the resulting SVG
//PARAM: dataset = array of data to draw
function drawBarGraph(id, w, h, dataset, amplify = 4) {
  var barPadding = 1;
  var svg = d3.select("#" + id).append("svg");

  svg.attr("width", w).attr("height", h);

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => { return i * (w / dataset.length); })
    .attr("y", (d, i) => { return h - (d * amplify)})
    .attr("width", w / dataset.length -barPadding)
    .attr("height", (d) => { return d * amplify; })
    .attr("fill", (d) => { return "rgb(0, 0, " + (d*10) + ")"});

  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((d) => { return d; })
    .attr("x", (d, i) => { return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", (d, i) => { return h - (d * amplify) + 14})
    .attr("fill", "white")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  return svg;
}
