//DOCS: graph_legend.js
//
//There are two functions in this file, which utilize d3 to draw a legend.
//First, before calling either, you must ensure that there is a <div> object
//with an ID somewhere in your project; this will be the container for the
//legend.
//
//  function drawGraphLegend(id, w, h, padding = {}, shift = {},
//    placement = "left", symbols = [], labels = [], callback = null)
//
//drawGraphLegend() creates a static SVG image of the legend, derived from the
//given input. ‘id’ is the unique ID of the <div> object, w and h are simply
//the width and height of the image canvas to create. Padding is a structure
//indicating how much empty space to insert along each edge of the SVG, with
//separate fields for the top, left, right and bottom edges. Shift is how much
//to move the elements, cummulatively. Placement is where to put the key box,
//either left or right.
//
//Symbols is an array representing the keys. They can be either a string
//literal, representing a color in the format '#RRGGBB', or a structure
//containing arbitrary data. The data structure must have a member called
//"symbol", indicating the type of key to use. Currently, only a line is
//implemented. See below for details. ‘labels’ is an array of strings
//containing each key’s label. Callback is a function that is called when the
//label or symbol is clicked.
//
//This function is designed to render static legends, however it can be used in
//conjunction with the following.
//
//  updateGraphLegend(id, symbols = [], labels = [], callback = null)
//
//This function is designed to act on a legend that was created by
//drawGraphLegend() (above). ‘id’ is the ID of the <div> element holding the
//SVG. 'symbols', 'labels' and callback are the replacements for the arguments
//given to drawGraphLegend(). This function, although available, is not
//supported.
//
//Keys
//
//Some complex data structures can be passed as parameters to symbols. One such
//structure represents a line, and looks like this:
//
//{
//  symbol: "line",
//  stroke: "...",
//  strokeWidth: ...,
//  meta: "...",
//}
//
//'symbol: "line"' indicates that this should draw a line as a key. 'stroke' is
//the color that should be used, and 'strokeWidth' is the number of pixels in
//width.
//
//The last field is 'meta', which is used for some types of lines, but not
//others. This field is optional. It can be set to 'stroke-array', to set the
//<line>'s stroke-dasharray element, equal to another optional field called
//'value'.
//
//BUGS:
//
//The behaviour when there are duplicate values in symbols is undefined.
//
//In order to have a horizontal legend, you must set the right padding to be
//equal to the number of elements minus one, and set width to equal a single
//element width. Then, set shift.horizontal to equal width as normal.

//TODO:
//
//All non-essential parameters to update*() can be -1 to keep as is.

//-----------------------------------------------------------------------------

//PARAM: id = the ID of a <div> element
//PARAM: w = width of the legend
//PARAM: h = height of the legend
//PARAM: padding = table containing elements:
//  top = padding on the top
//  left = padding on the left
//  right = padding on the right
//  bottom = padding on the bottom
//PARAM: shift = amount to move elements, commulative
//  horizontal = horizontal direction
//  vertical = vertical direction
//PARAM: placement = where to place the box, "left" or "right"
//PARAM: symbols = colors/metadata to draw as a key
//PARAM: labels = labels for the keys
//PARAM: callback = the callback function used by onClick
function drawGraphLegend(id, w, h, padding = {top: 0, left: 0, right: 0, bottom: 0}, shift = {horizontal: 0, vertical: 0}, placement = "left", symbols = [], labels = [], callback = null) {
  //create SVG object
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("padding-top", padding.top)
    .attr("padding-left", padding.left)
    .attr("padding-right", padding.right)
    .attr("padding-bottom", padding.bottom)
    .attr("shift-horizontal", shift.horizontal)
    .attr("shift-vertical", shift.vertical)
    .attr("placement", placement)
    .append("g");

  //add the classes (elements of the SVG)
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "symbols");

  updateGraphLegend(id, symbols, labels, callback);

  return svg; 
}

//PARAM: id = the ID of a <div> element
//PARAM: symbols = colors/metadata to draw as a key
//PARAM: labels = labels for the keys
//PARAM: callback = the callback function used by onClick
function updateGraphLegend(id, symbols = [], labels = [], callback) {
  var svg = d3.select("#" + id).select("svg");

  //get width, height, shift, padding and placement
  var placement = svg.attr("placement");

  var padding = {
    top: Number(svg.attr("padding-top")),
    left: Number(svg.attr("padding-left")),
    right: Number(svg.attr("padding-right")),
    bottom: Number(svg.attr("padding-bottom"))
  }

  var shift = {
    horizontal: Number(svg.attr("shift-horizontal")),
    vertical: Number(svg.attr("shift-vertical"))
  }

  var w = svg.attr("width") - padding.left - padding.right;
  var h = svg.attr("height") - padding.top - padding.bottom;

  //handle the labels
  var labelSelector = svg.select(".labels")
    .selectAll("text")
    .data(labels);

  labelSelector
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("font-size", 12)
    .attr("font-family", "sans-serif")
    .attr("dy", "1em")
    .attr("x", function(d, i) { return padding.left + i*(shift.horizontal); })
    .attr("y", function(d, i) { return padding.top + i*(shift.vertical); });

  labelSelector
    .text(function(d) { return d; })
    .on("click", function(d, i) { if (callback) callback(i); });

  labelSelector
    .exit()
    .remove();

  //handle strings = colors
  var colors = symbols.filter(function(d) { return typeof(d) === 'string'; });
  var count = 0;

  var symbolsRect = svg.select(".symbols")
    .selectAll("rect")
    .data(colors);

  symbolsRect
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return padding.left + symbols.indexOf(d)*shift.horizontal; })
    .attr("y", function(d, i) { return padding.top + symbols.indexOf(d)*shift.vertical +1; })
    .attr("width", 20)
    .attr("height", 12)
    .attr("fill", function(d) { return colors[count++]; })

  symbolsRect
    .on("click", function(d, i) { if (callback) callback(i); });

  //handle object = arbitrary data (customizable)
  var objects = symbols.filter(function(d) { return typeof(d) === 'object'; });
  var count = 0;

  objects.map(function(x) {
    switch(x.symbol) {
      case 'line':
        var l = svg.select(".symbols")
          .selectAll("line")
          .data([x])
          .enter()
          .append("line")
          .attr("x1", function(d) { return padding.left + symbols.indexOf(d)*shift.horizontal; })
          .attr("y1", function(d) { return padding.top  + symbols.indexOf(d)*shift.vertical + 7; })
          .attr("x2", function(d) { return padding.left + symbols.indexOf(d)*shift.horizontal + 20; })
          .attr("y2", function(d) { return padding.top  + symbols.indexOf(d)*shift.vertical + 7; })
          .attr("stroke", x.stroke)
          .attr("stroke-width", x.strokeWidth)

        if (x.meta === "stroke-array") {
          l.attr("stroke-dasharray", x.value);
        }
      break;
    }
  });

  //tweak box and label positions
  if (placement == "right") {
    svg.select(".symbols")
      .selectAll("rect")
      .attr("x", function(d) { return padding.left + symbols.indexOf(d)*shift.horizontal +w -20; });

    svg.select(".symbols")
      .selectAll("line")
      .attr("x1", function(d) { return padding.left + symbols.indexOf(d)*shift.horizontal +w -20; })
      .attr("x2", function(d) { return padding.left + symbols.indexOf(d)*shift.horizontal +w; });
      
  }
  else {
    labelSelector.attr("dx", 20);
  }
}
