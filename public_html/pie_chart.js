//PARAM: id = the ID of a <div> element
//PARAM: w = width of the resulting SVG
//PARAM: h = height of the resulting SVG
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
function drawPieGraph(id, w, h, dataset = [], labels = [], colors = []) {
  //calc radius
  r = Math.min(w, h) /2;

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
    .attr("fill", function(d, i) { return colorOrdinal(i); })
    .text(function(d) { return d; })
    .attr("transform", function(d, i) {
      var outerCenter = outerArc.centroid(pie(dataset)[i]);
      var shift = midAngle(pie(dataset)[i]) < Math.PI ? (w/2) : (-w/2);
      return "translate(" + [shift, outerCenter[1]] + ")"; 
    })
    .style("text-anchor", function(d, i) {
      return midAngle(pie(dataset)[i]) < Math.PI ? "start" : "end";
    });

  //add polylines to slice and text
  svg.select(".lines").selectAll("polyline")
    .data(pie(dataset))
    .enter()
    .append("polyline")
    .attr("opacity", "1")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .attr("fill", "none")
    .attr("points", function(d, i) {
      var pos = arc.centroid(d);
      var outerPos = outerArc.centroid(d);
      var shift = midAngle(pie(dataset)[i]) < Math.PI ? (w/2) : (-w/2);
      return "" + pos + " " + outerPos + " " + [shift, outerPos[1]];
    });

  return svg;
}

//PARAM: id = the ID of a <div> element
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
//PARAM: duration = time in ms update transition takes
function updatePieGraph(id, dataset = [], labels = [], colors = [], duration = 1000) {
  var svg = d3.select("#" + id).select("svg");

  //get width & height
  var w = svg.attr("width");
  var h = svg.attr("height");
  var r = Math.min(w, h) /2;

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

  //adjust the slices
  var slices = svg.select(".slices")
    .selectAll("path.slice")
    .data(pie(dataset));

  slices
    .enter()
    .append("path")
    .attr("fill", (d, i) => { return colorOrdinal(i); })
    .attr("class", "slice");

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
