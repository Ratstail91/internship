//PARAM: node = the <div> element to contain the svg
//PARAM: w = width of the pie graph
//PARAM: h = height of the pie graph
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: dataset = array structures containing data to draw:
//  value = the value to be drawn
//  label = label to be drawn
//  color = colors to use for the slice
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

//PARAM: node = the <div> element to contain the svg
//PARAM: dataset = array structures containing data to draw:
//  value = the value to be drawn
//  label = label to be drawn
//  color = colors to use for the slice
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
/*
  //initialize text labels
  labels = svg.select(".labels")
    .selectAll("text")
    .data(dataset);

  //create new labels
  labels
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .attr("font-size", "14px");

  labels
    .style("fill", function(d, i) { return d.color; })
    .text(function(d) { return d.label; })
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

  //enable only the active labels
  labels
    .attr("display", "none")
    .filter(function(d,i) {
      return slices.filter(function(d, f) { return f === i; }).attr("active") === "true";
     })
    .attr("display", "inline");

  //remove old labels
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
    .attr("fill", "none")
    .style("pointer-events", "none");

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
*/
  return svg;
}
/*
//PARAM: svg = SVG object created with drawPieGraph()
//PARAM: index = index of the slice to activate
//PARAM: lock = whether to lock the slice in this state
function activateSlice(svg, index, lock = false) {


  //find and tweak label 'index'
  labels
    .filter(function(d, f) { return f === index; })
    .transition()
    .duration(duration)
    .attrTween("transform", function(d, i) {
      //interpolate between the two positions (of the slices)
      var interpolate;

      slices
        .each(function(d, i) {
          if (i === index) {
            interpolate = d3.interpolate(outerArc.centroid(d), buffOuterArc.centroid(d));
          }
      });

      return function(t) {
        var interCenter = interpolate(t);
        var shift = interCenter[0] > 0 ? (w/2) : (-w/2);
        return "translate(" + [shift, interCenter[1]] + ")";
      };
    });

  //get the lines
  var lines = svg.select(".lines").selectAll("polyline");

  //enable only the active lines
  lines
    .attr("display", "none")
    .filter(function(d,i) {
      return slices.filter(function(d, f) { return f === i; }).attr("active") === "true";
     })
    .attr("display", "inline");

  //find and tweak the line 'index'
  lines
    .filter(function(d, f) { return f === index; })
    .transition()
    .duration(duration)
    .attrTween("points", function(d, i) {
      //interpolate between the two positions (of the slices)
      var interpolate;
      var pos;

      slices
        .each(function(d, i) {
          if (i === index) {
            interpolate = d3.interpolate(outerArc.centroid(d), buffOuterArc.centroid(d));
            pos = arc.centroid(d);
          }
      });

      return function(t) {
        var interCenter = interpolate(t);
        var shift = interCenter[0] > 0 ? (w/2) : (-w/2);
        return "" + pos + " " + interCenter + " " + [shift, interCenter[1]];
      };
    });
}

//PARAM: svg = SVG object created with drawPieGraph()
//PARAM: index = index of the slice to deactivate
//PARAM: unlock = whether to unlock the slice if locked
function deactivateSlice(svg, index, unlock = false) {

  //get the labels
  var labels = svg.select(".labels").selectAll("text");

  //determine how many labels are active
  var anyOn = false;

  //enable only the active labels
  labels
    .attr("display", "none")
    .filter(function(d,i) {
      ret = slices.filter(function(d, f) { return f === i; }).attr("active") === "true";
      if (ret) anyOn = true;
      return ret;
     })
    .attr("display", "inline");

  //enable all labels if none are active
  if (!anyOn) {
    labels.attr("display", "inline");
  }

  //find and tweak the label 'index'
  labels
    .filter(function(d, f) { return f === index; })
    .transition()
    .duration(duration)
    .attrTween("transform", function(d, i) {
      //interpolate between the two positions (of the slices)
      var interpolate;

      slices
        .each(function(d, i) {
          if (i === index) {
            interpolate = d3.interpolate(buffOuterArc.centroid(d), outerArc.centroid(d));
          }
      });

      return function(t) {
        var interCenter = interpolate(t);
        var shift = interCenter[0] > 0 ? (w/2) : (-w/2);
        return "translate(" + [shift, interCenter[1]] + ")";
      };
    });

  //get the lines
  var lines = svg.select(".lines").selectAll("polyline");

  //determine how many lines are active
  anyOn = false;

  //enable only the active lines
  lines
    .attr("display", "none")
    .filter(function(d,i) {
      ret = slices.filter(function(d, f) { return f === i; }).attr("active") === "true";
      if (ret) anyOn = true;
      return ret;
     })
    .attr("display", "inline");

  //enable all lines if none are active
  if (!anyOn) {
    lines.attr("display", "inline");
  }

  //find and tweak the line 'index'
  lines
    .filter(function(d, f) { return f === index; })
    .transition()
    .duration(duration)
    .attrTween("points", function(d, i) {
      //interpolate between the two positions (of the slices)
      var interpolate;
      var pos;

      slices
        .each(function(d, i) {
          if (i === index) {
            interpolate = d3.interpolate(buffOuterArc.centroid(d), outerArc.centroid(d));
            pos = arc.centroid(d);
          }
      });

      return function(t) {
        var interCenter = interpolate(t);
        var shift = interCenter[0] > 0 ? (w/2) : (-w/2);
        return "" + pos + " " + interCenter + " " + [shift, interCenter[1]];
      };
    });
}
*/
