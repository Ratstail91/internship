//PARAM: node = the <div> element to contain the svg
//PARAM: w = width of the pie graph
//PARAM: h = height of the pie graph
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: dataset = array of structures passed to updatePieGraph():
//  value = the value to be drawn
//  label = label to be drawn
//  color = colors to use
//  active = whether the slice is active or not
//  mouseOver (optional) = called when a mouseOver event occurs, takes id as a parameter
//  mouseOut (optional) = called when a mouseOut event occurs, takes id as a parameter
//  id (optional) = passed to mouseOver and mouseOut
function drawPieGraph(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, dataset = []) {
  //create the SVG object
  var svg = d3.select(node).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding", JSON.stringify(padding))
    .append("g")
    //move the origin to the center of the image
    .attr("transform", "translate(" + (padding.left + (w / 2)) + "," + (padding.top + (h / 2)) + ")");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "lines");

  //call the lower part of this process
  return updatePieGraph(node, dataset, 1000);
}

//PARAM: node = the <div> element that contains the svg created by drawPieGraph
//PARAM: dataset = array of structures containing data to draw:
//  value = the value to be drawn
//  label = label to be drawn
//  color = colors to use
//  active = whether the slice is active or not
//  mouseOver (optional) = called when a mouseOver event occurs, takes id as a parameter
//  mouseOut (optional) = called when a mouseOut event occurs, takes id as a parameter
//  id (optional) = passed to mouseOver and mouseOut
//PARAM: duration = time that the transition should take
function updatePieGraph(node, dataset, duration = 1000) {
  //get the SVG
  var svg = d3.select(node).select("svg");

  //get width, height, radius and padding
  var padding = JSON.parse(svg.attr("padding"));
  var w = svg.attr("width") - padding.left - padding.right;
  var h = svg.attr("height") - padding.top - padding.bottom;
  var r = Math.min(w, h) /2;

  //utilities
  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

  var outerArc = d3.svg.arc()
    .innerRadius(r)
    .outerRadius(r*1.1);

  var buffArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r*1.1);

  var buffOuterArc = d3.svg.arc()
    .innerRadius(r*1.1)
    .outerRadius(r*1.2);

  var pie = d3.layout.pie()
    .value(function(d) { return d.value; })
    .sort(null);

  function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

  //initialize the slices
  var slices = svg.select(".slices")
    .selectAll("path.slice")
    .data(pie(dataset));

  //create new slices
  slices
    .enter()
    .append("path")
    .attr("class", "slice");

  //static components that every slice needs
  slices
    .attr("fill", (d, i) => { return d.data.color; })
    .on("mouseover", function(d, i) { if (d.data.mouseOver) d.data.mouseOver(d.data.id); })
    .on("mouseout", function(d, i) { if (d.data.mouseOut) d.data.mouseOut(d.data.id); })

    .transition()
    .duration(duration)
    .attr("d", function(d) {
      if (d.data.active) {
        return buffArc(d);
      }
      else {
        return arc(d);
      }
    })
    .attr("transform", function(d) {
      if(d.data.active) {
        return "translate(" + Math.cos(Math.PI/2-(midAngle(d))) * 5 + "," + -Math.sin(Math.PI/2-(midAngle(d))) * 5 + ")";
      }
      else {
        return "translate(0,0)";
      }
    });

  //remove old slices
  slices
    .exit()
    .remove();

  //initialize text labels
  labels = svg.select(".labels")
    .selectAll("text")
    .data(pie(dataset));

  //create new labels
  labels
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .attr("font-size", "14px");

  //static aspects that all labels need
  labels
    .style("fill", function(d, i) { return d.data.color; })
    .text(function(d) { return d.data.label; })
    .transition()
    .duration(duration)
    .attr("transform", function(d, i) {
      //place the text on the sides of the SVG
      var shift = midAngle(d) < Math.PI ? (w/2) : (-w/2);
      var pos;
      if (d.data.active) {
        pos = buffOuterArc.centroid(d);
      }
      else {
        pos = outerArc.centroid(d);
      }
      return "translate(" + shift + "," + pos[1] + ")";
    })
    .style("text-anchor", function(d, i) {
      //anchor the text at the correct position
      return midAngle(d) < Math.PI ? "start" : "end";
    });

  //display only active labels
  labels
    //set all labels to visible
    .attr("display", "inline");

  dataset.map(function(x) {
    //if any slices are active, set all labels to invisible
    if (x.active) {
      labels.attr("display", "none");
    }
  });

  labels
    //reenable only active labels
    .filter(function(d,i) { return d.data.active; })
    .attr("display", "inline");

  //remove old labels
  labels
    .exit()
    .remove();

  //initialize the polylines
  var lines = svg.select(".lines")
    .selectAll("polyline")
    .data(pie(dataset));

  //create new lines
  lines
    .enter()
    .append("polyline")
    .attr("opacity", "1")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .attr("fill", "none")
    .style("pointer-events", "none");

  //static components that every line needs
  lines
    .transition()
    .duration(duration)
    .attr("points", function(d, i) {
      var pos;
      var outerPos;
      if (d.data.active) {
        pos = buffArc.centroid(d);
        outerPos = buffOuterArc.centroid(d);
      }
      else {
        pos = arc.centroid(d);
        outerPos = outerArc.centroid(d);
      }
      shift = midAngle(d) < Math.PI ? (w/2) : (-w/2);
      return "" + pos + " " + outerPos + " " + [shift, outerPos[1]];
    });

  //display only active lines
  lines
    //set all lines to visible
    .attr("display", "inline");

  dataset.map(function(x) {
    //if any slices are active, set all lines to invisible
    if (x.active) {
      lines.attr("display", "none");
    }
  });

  lines
    //reenable only active lines
    .filter(function(d,i) { return d.data.active; })
    .attr("display", "inline");

  //remove old lines
  lines
    .exit()
    .remove();

  return svg;
}
