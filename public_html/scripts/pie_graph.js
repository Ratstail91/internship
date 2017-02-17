function drawPieGraph(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, dataset = []) {
  //calc radius
  r = Math.min(w, h) /2;

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
  updatePieGraph(node, dataset, 1000);

  return svg;
}

function updatePieGraph(node, dataset, duration = 1000) {
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
    .outerRadius(r * 1.1);

  var pie = d3.layout.pie()
    .value((d) => { return d.value; })
    .sort(null);

  //adjust the slices
  var slices = svg.select(".slices")
    .selectAll("path.slice")
    .data(pie(dataset));

  slices
    .enter()
    .append("path")
    .attr("class", "slice")
    .attr("fill", (d, i) => { return d.data.color; });

  slices
    .transition()
    .duration(duration)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        //TODO: fix size-on-update bug here
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
    .data(dataset);

  labels
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .attr("font-size", "14px")
    .style("fill", function(d, i) { return d.color; });

  labels
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
