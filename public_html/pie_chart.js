//PARAM: id = the ID of a <div> element
//PARAM: w = width of the resulting SVG
//PARAM: h = height of the resulting SVG
//PARAM: r = radius of the graph, normally Math.min(w, h) /2
//PARAM: dataset = array of data to draw
//PARAM: colors = array of colors to use
function drawPieGraph(id, w, h, r, dataset, colors) {
  //reformat the arguments
  if (r == -1) {
    r = Math.min(w, h) /2;
  }

  colors = d3.scale.ordinal().range([...colors]);

  //do the stuff
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

  var pie = d3.layout.pie()
    .value((d) => { return d; })
    .sort(null);

  var path = svg.selectAll("path")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => { return colors(i); });
}
