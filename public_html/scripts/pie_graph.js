//DOCS: pie_graph.js
//
//There are five functions in this file, which utilize d3 to draw a pie graph.
//First, before calling either, you must ensure that there is a <div> object
//with an ID somewhere in your project; this will be the container for the pie
//graph.
//
//  function drawPieGraph(node, w, h, padding,
//    dataset = [], labels = [], colors = [])
//
//drawPieGraph() creates a static SVG image of the pie graph, derived from the
//given input. ‘node’ <div> element to contain the svg, w and h are simply
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
//  updatePieGraph(node, dataset = [], labels = [], colors = [], duration = 1000)
//
//This function is designed to act on a pie graph that was created by
//drawPieGraph() (above). ‘node’ the <div> element holding the SVG.
//‘dataset’ is the new data to be displayed, while ‘labels’ are their
//corresponding labels. Finally, ‘colors’ must also be passed and, as above, if
//there are fewer colors than sectors, colors will be reused. 
//
//There is an extra parameter here, “duration”. This allows you to set, in
//milliseconds, the amount of time the transition between the previous graph
//state and the new one should take. This transition is animated thanks to the
//power of d3, but as I said, updatePieGraph() can ONLY act on pie graphs
//created by drawPieGraph(), it can’t create it’s own.
//
//  activateSlice(svg, index, lock)
//
//This is a utility function used for manually activating a slice's mouse hover
//animation. 'svg' is the svg created with drawPieGraph(), and 'index' is the
//index of the slice to activate. 'lock' is whether the slice should be locked
//in it's activated state.
//
//  deactivateSlice(svg, index, unlock)
//
//Similar to activateSlice(), this function is used instead to reverse that
//slice's animation. 'svg' is the svg created with drawPieGraph(), and 'index'
//is the index of the slice to deactivate. 'unlock' is whether the slice should
//be forcibly unlocked from it's locked state.
//
//  toggleSlice(svg, index, lock)
//
//Finally, this slice will toggle a slice's activation state between on and
//off. 'svg' is the svg created with drawPieGraph(), and 'index' is the index
//of the slice to toggle. 'lock' is passed as the third parameter to
//activateSlice() and deactivateSlice().

//TODO:
//
//All non-essential parameters to update*() can be -1 to keep as is.

//-----------------------------------------------------------------------------

//PARAM: node = the <div> element to contain the svg
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
function drawPieGraph(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, dataset = [], labels = [], colors = []) {
  //calc radius
  r = Math.min(w, h) /2;

  //create the SVG object
  var svg = d3.select(node).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding-top", padding.top)
    .attr("padding-left", padding.left)
    .attr("padding-right", padding.right)
    .attr("padding-bottom", padding.bottom)
    .append("g")
    //move the origin to the center of the image
    .attr("transform", "translate(" + (padding.left + (w / 2)) + "," + (padding.top + (h / 2)) + ")");
console.log("MARK 1", svg);
  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "lines");

  //call the lower part of this process
  updatePieGraph(node, dataset, labels, colors, 1000);

  return svg;
}

//PARAM: node = the <div> element containing the svg
//PARAM: dataset = array of data to draw
//PARAM: labels = labels to be drawn onto the chart
//PARAM: colors = array of colors to use
//PARAM: duration = time in ms update transition takes
function updatePieGraph(node, dataset = [], labels = [], colors = [], duration = 1000) {
  var svg = d3.select(node).select("svg");

  //get width, height, radius and padding
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

  slices.on("mouseover", function(d, i) { activateSlice(svg, i); });
  slices.on("mouseout", function(d, i) { deactivateSlice(svg, i); });

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

  return svg;
}

//PARAM: svg = SVG object created with drawPieGraph()
//PARAM: index = index of the slice to activate
function activateSlice(svg, index, lock = false) {
  //constants
  var duration = 300;

  //get width, height, radius and padding
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
    .outerRadius(r*1.2)

  function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

  //get the slices
  var slices = svg.select(".slices").selectAll("path.slice");

  //if the slice 'index' is locked, return
  if (slices.filter(function(d, f) { return f === index; }).attr("locked") === "true") {
    return;
  }

  //find and tweak slice 'index'
  slices
    .filter(function(d, f) { return f === index; })
    .attr("active", true)
    .attr("locked", lock)
    .transition()
    .duration(duration)
    .attrTween("d", function(d) {
      //interpolate between the two positions
      var interpolate = d3.interpolate(arc(d), buffArc(d));
      return function(t) {
        return interpolate(t);
      }
    })
    .attrTween("transform", function(d) {
      var interpolate = d3.interpolate([0,0], [
        Math.cos(Math.PI/2-(midAngle(d))) * 5,
        -Math.sin(Math.PI/2-(midAngle(d))) * 5
      ]);
      return function(t) {
        return "translate(" + interpolate(t) + ")";
      }
    });

  //get the labels
  var labels = svg.select(".labels").selectAll("text");

  //enable only the active labels
  labels
    .attr("display", "none")
    .filter(function(d,i) {
      return slices.filter(function(d, f) { return f === i; }).attr("active") === "true";
     })
    .attr("display", "inline");

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
function deactivateSlice(svg, index, unlock = false) {
  //constants
  var duration = 300;

  //get width, height, radius and padding
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
    .outerRadius(r*1.2)

  function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

  //get the slices
  var slices = svg.select(".slices").selectAll("path.slice");

  //if the slice is locked, and unlock is not true, return
  if (
    slices.filter(function(d, f) { return f === index; }).attr("locked") === "true" &&
    unlock != true
  ) {
    return;
  }

  //find and tweak the slice 'index'
  slices
    .filter(function(d, f) { return f === index; })
    .attr("active", false)
    .attr("locked", false)
    .transition()
    .duration(300)
    .attrTween("d", function(d) {
      var interpolate = d3.interpolate(buffArc(d), arc(d));
      return function(t) {
        return interpolate(t);
      }
    })
    .attrTween("transform", function(d) {
      var interpolate = d3.interpolate([
        Math.cos(Math.PI/2-(midAngle(d))) * 5,
        -Math.sin(Math.PI/2-(midAngle(d))) * 5
      ], [0,0]);
      return function(t) {
        return "translate(" + interpolate(t) + ")";
      }
    });

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

//PARAM: svg = SVG object created with drawPieGraph()
//PARAM: index = index of the slice to toggle
function toggleSlice(svg, index, lock = false) {
  //get the slices
  var slices = svg.select(".slices").selectAll("path.slice");

  var active;

  //find the state of the slice 'index'
  slices.each(function(d, i) {
    if (i === index) {
      active = d3.select(this).attr("active");
    }
  });

  //flip the given slice
  if (active === "true") {
    deactivateSlice(svg, index, lock);
  }
  else {
    activateSlice(svg, index, lock);
  }
}
