//PARAM: node = the <div> element to contain the svg
//PARAM: w = width of the legend
//PARAM: h = height of the legend
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: shift = amount to move elements, commulative:
//  horizontal = horizontal direction
//  vertical = vertical direction
//PARAM: dataset = data to be drawn:
//  symbol = colors/metadata to draw as a key
//  label = labels for the keys
//  callback = the callback function used by onClick;
//    this returns true to toggle the background
function drawGraphLegend(node, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, shift = {horizontal: 0, vertical: 0}, dataset = []) {
  //create SVG object
  var svg = d3.select(node).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding", JSON.stringify(padding))
    .attr("shift", JSON.stringify(shift))
    .append("g");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "backgrounds");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "symbols");

  updateGraphLegend(node, dataset);

  return svg; 
}

//PARAM: node = the <div> element to contain the svg
//PARAM: dataset = data to be drawn:
//  symbol = colors/metadata to draw as a key
//  label = labels for the keys
//  callback = the callback function used by onClick;
//    this returns true to toggle the background
//TODO: re-add the placement feature
function updateGraphLegend(node, dataset) {
  var svg = d3.select(node).select("svg");

  //get width, height, shift and padding
  var padding = JSON.parse(svg.attr("padding"));
  var shift = JSON.parse(svg.attr("shift"));

  var w = svg.attr("width") - padding.left - padding.right;
  var h = svg.attr("height") - padding.top - padding.bottom;

  //initialize the labels
  var labelSelector = svg.select(".labels")
    .selectAll("text")
    .data(dataset);

  //create new labels
  labelSelector
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif")
    .attr("dy", "0.9em")
    .attr("x", function(d, i) { return padding.left + i*(shift.horizontal); })
    .attr("y", function(d, i) { return padding.top + i*(shift.vertical); });

  //static members that all labels need
  labelSelector
    .text(function(d) { return d.label; })
    .on("click", function(d, i) { if (d.callback) d.callback(d.id); });

  //remove unneeded labels
  labelSelector
    .exit()
    .remove();

  //handle strings = colors
  var colorSymbols = dataset.filter(function(d) { return typeof(d.symbol) === 'string'; });
  var count = 0;

  //initialize symbolsRect
  var symbolsRect = svg.select(".symbols")
    .selectAll("rect")
    .data(colorSymbols);

  //create new color symbols
  symbolsRect
    .enter()
    .append("rect");

  //static attributes that all rect symbols need
  symbolsRect
    .attr("x", function(d, i) { return padding.left + dataset.indexOf(d)*shift.horizontal; })
    .attr("y", function(d, i) { return padding.top + dataset.indexOf(d)*shift.vertical +1; })
    .attr("width", 20)
    .attr("height", 12)
    .attr("fill", function(d) { return colorSymbols[count++].symbol; })
    .on("click", function(d, i) { if (d.callback) d.callback(d.id); });

  //handle object = arbitrary data (customizable)
  var objectSymbols = dataset.filter(function(d) { return typeof(d.symbol) === 'object'; });

  objectSymbols.map(function(x) {
    switch(x.symbol.symbol) {
      case 'line':
        var l = svg.select(".symbols")
          .selectAll("line")
          .data([x])
          .enter()
          .append("line")
          .attr("x1", function(d) { return padding.left + dataset.indexOf(d)*shift.horizontal; })
          .attr("y1", function(d) { return padding.top  + dataset.indexOf(d)*shift.vertical + 7; })
          .attr("x2", function(d) { return padding.left + dataset.indexOf(d)*shift.horizontal + 20; })
          .attr("y2", function(d) { return padding.top  + dataset.indexOf(d)*shift.vertical + 7; })
          .attr("stroke", x.symbol.stroke)
          .attr("stroke-width", x.symbol.strokeWidth)

        if (x.symbol.meta === "stroke-array") {
          l.attr("stroke-dasharray", x.symbol.value);
        }
      break;

      //TODO: more symbol features
    }
  });

  //tweak box and label positions
  //NOTE: placement was removed
  labelSelector.attr("dx", 24);

  //place the backgrounds
  var backgrounds = svg.select(".backgrounds")
    .selectAll("rect")
    .data(dataset);

  //new backgrounds
  backgrounds
    .enter()
    .append("rect");

  //static attributes that all backgrounds need
  backgrounds
    .attr("x", function(d, i) { return padding.left + i*(shift.horizontal) + 22; })
    .attr("y", function(d, i) { return padding.top + i*(shift.vertical) + 1; })
    .attr("width", shift.horizontal ? shift.horizontal - 24 : w - 24)
    .attr("height", shift.vertical ? shift.vertical - 2 : h - 2)
    .attr("fill", function(d) { return '#888888'; })
    .attr("rx", 6)
    .attr("ry", 6)
    //the magic
    .attr("display", function(d) { return d.locked ? "inline" :"none"; });

  //remove unneeded backgrounds
  backgrounds
    .exit()
    .remove();
}

