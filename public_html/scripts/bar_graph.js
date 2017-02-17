function drawBarGraph(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0, bar: 1}, titles = {x: '', y: ''}, dataset = [], colors = []) {
  //constants
  titlePadding = 12;

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

  updateBarGraph(node, dataset, 1000);

  return svg;
}

function updateBarGraph(node, dataset, duration = 1000) {
  //constants
  titlePadding = 12;

  var svg = d3.select(node).select("svg");

  //get width, height and padding
  var padding = JSON.parse(svg.attr("padding"));

  var w = svg.attr("width") - padding.left - padding.right - titlePadding;
  var h = svg.attr("height") - padding.top - padding.bottom - titlePadding;

  //get the other stuff
  var titles = JSON.parse(svg.attr("titles"));
  var colors = JSON.parse(svg.attr("colors"));

  //get the average
  var average;

  if(dataset.length != 0) {
    average = dataset.reduce(function(a, b) { return a+b.value; }, 0) / dataset.length;
  }
  else {
    average = 0;
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

  //adjust the tooltips
  tooltips = svg.select(".tooltips")
    .selectAll("text")
    .data(dataset);

  tooltips
    .enter()
    .append("text")
    .attr("class", "tips")
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w/dataset.length) + (w/dataset.length - padding.bar) / 2; })
      .attr("text-anchor", "middle")
    .attr("y", function(d, i) { return padding.top + yScale(d.value); })
      .attr("dy", "1em");

  tooltips
    .text(function(d) { return d.value; })
    .attr("fill", "white")
    .attr("display", "none")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif");

  tooltips
    .transition()
    .duration(duration)
    .attrTween("y", function(d, i) {
      this._current = this._current || d.value;
      var interpolate = d3.interpolate(this._current, d.value);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    });

  tooltips
    .exit()
    .remove();

  //adjust the bars
  bars = svg.select(".bars")
    .selectAll("rect")
    .data(dataset);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w / dataset.length); })
    .attr("y", function(d, i) { return padding.top + yScale(d.value); })
    .attr("width", w / dataset.length -padding.bar)
    .attr("height", function(d) { return h - yScale(d.value); })
    //TODO: fix the size-on-update bug here (bar version)
    .attr("fill", (d) => { return colors[d.value < average]; });

  bars
    .on("mouseover", function(d, i) {
      activateBar(svg, i);
    })
    .on("mouseout", function(d, i) {
      deactivateBar(svg, i);
    });

  bars
    .transition()
    .duration(duration)
    .attrTween("y", function(d, i) {
      this._current = this._current || d.value;
      var interpolate = d3.interpolate(this._current, d.value);
      this._current = interpolate(0);
      return function(t) {
        return padding.top + yScale(interpolate(t));
      }
    })
    .attrTween("height", function(d, i) {
      this._current = this._current || d.value;
      var interpolate = d3.interpolate(this._current, d.value);
      this._current = interpolate(0);
      return function(t) {
        return h - yScale(interpolate(t));
      }
    })
    .attrTween("fill", function(d, i) {
      this._current = this._current || d.value;
      var interpolate = d3.interpolate(this._current, d.value);
      this._current = interpolate(0);
      return function(t) {
        return colors[interpolate(t) < average ? 0:1];
      }
    })

  bars
    .exit()
    .remove();

  //create and place the labels
  svg.select(".labels").selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(function(d) { return d.label; })
    .attr("x", function(d, i) { return padding.left + titlePadding + i * (w/dataset.length) + (w/dataset.length -padding.bar) / 2; })
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

  //draw the titles (x & y)
  if (titles != -1 && titles.x !== '') {
    //x title
    svg.select(".titles").selectAll(".x-title").remove();

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

  if (titles != -1 && titles.y !== '') {
    //y title
    svg.select(".titles").selectAll(".y-title").remove();

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

  //draw the X-axis line
  svg.select(".xaxis").remove();

  svg.append("g")
    .attr("class", "xaxis")
    .selectAll("line")
    .data([[0, h, w, h]])
    .enter()
    .append("line")
    .attr("x1", (d) => { return padding.left + titlePadding + d[0]; })
    .attr("y1", (d) => { return padding.top + d[1]; })
    .attr("x2", (d) => { return padding.left + titlePadding + d[2]; })
    .attr("y2", (d) => { return padding.top + d[3]; })
    .style("stroke", "black")
    .style("stroke-width", "2");

  return svg;
}

//PARAM: svg = SVG object created with drawBarGraph()
//PARAM: index = index pf the bar to activate
function activateBar(svg, index, lock = false) {
  //constants
  duration = 100;

  //get the bars
  var bars = svg.select(".bars").selectAll("rect");

  //if the bar 'index' is locked, return
  if (bars.filter(function(d, f) { return f === index; }).attr("locked") === "true") {
    return;
  }

  //calculate the average
  var count = 0;
  var total = 0;

  bars.each(function(d) {
    total = total + d.value;
    count = count + 1;
  });

  var average = total / count;

  //utilities
  var colors = JSON.parse(svg.attr("colors"));

  //find and tweak the bar 'index'
  bars
    .filter(function(d, f) { return index === f; })
    .attr("active", true)
    .attr("locked", lock)
    .transition()
    .duration(duration)
    .attrTween("fill", function(d) {
      var lower = colors[(d.value<average) ? 0:1];
      var upper = colors[(d.value<average) ? 2:3];
      var interpolate = d3.interpolate(lower, upper);
      return function(t) {
        return interpolate(t);
      }
    });

  //get the tooltips
  var tooltips = svg.select(".tooltips").selectAll("text");

  //find and tweak the tooltip 'index'
  tooltips
    .filter(function(d, f) { return f === index; })
    .attr("display", "inline");
}

//PARAM: svg = SVG object created with drawBarGraph()
//PARAM: index = index pf the bar to deactivate
function deactivateBar(svg, index, unlock = false) {
  //constants
  duration = 100;

  //get the bars
  var bars = svg.select(".bars").selectAll("rect");

  //if the bar is locked, and unlock is not true, return
  if (
    bars.filter(function(d, f) { return f === index; }).attr("locked") === "true" &&
    unlock != true
    ) {
    return;
  }

  //calculate the average
  var count = 0;
  var total = 0;

  bars.each(function(d) {
    total = total + d.value;
    count = count + 1;
  });

  var average = total / count;

  //utilities
  var colors = JSON.parse(svg.attr("colors"));

  //find and tweak the bar 'index'
  bars
    .filter(function(d, f) { return index === f; })
    .attr("active", false)
    .attr("locked", false)
    .transition()
    .duration(duration)
    .attrTween("fill", function(d) {
      var lower = colors[(d.value<average) ? 0:1];
      var upper = colors[(d.value<average) ? 2:3];
      var interpolate = d3.interpolate(upper, lower);
      return function(t) {
        return interpolate(t);
      }
    });

  //get the tooptips
  var tooltips = svg.select(".tooltips").selectAll("text");

  //find and tweak the tooltip 'index'
  tooltips
    .filter(function(d, f) { return f === index; })
    .attr("display", "none");
}

//PARAM: svg = SVG object created with drawBarGraph()
//PARAM: index = index pf the bar to toggle
function toggleBar(svg, index, lock) {
  //get the bars
  bars = svg.select(".bars").selectAll("rect");

  var active;

  //find the state of the bar 'index'
  bars.each(function(d, i) {
    if (i === index) {
      active = d3.select(this).attr("active");
    }
  });

  //flip the given bar
  if (active === "true") {
    deactivateBar(svg, index, lock);
  }
  else {
    activateBar(svg, index, lock);
  }
}

