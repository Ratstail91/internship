import * as d3 from 'd3';

import { drawPieGraph, updatePieGraph } from '../scripts/pie_graph.js';
import { drawBarGraph, updateBarGraph } from '../scripts/bar_graph.js';
import { drawGraphLegend, updateGraphLegend } from '../scripts/graph_legend.js';

describe("Graph Test Suite", function() {
  it("Functions Are Defined", function() {
    expect(drawPieGraph).toBeDefined();
    expect(updatePieGraph).toBeDefined();
    expect(drawBarGraph).toBeDefined();
    expect(updateBarGraph).toBeDefined();
    expect(drawGraphLegend).toBeDefined();
    expect(updateGraphLegend).toBeDefined();
  });

  it("Testing Pie Graph", function() {
    //create the root node
    var rootNode = document.createElement('DIV');

    //create the initial parameters
    var w = 500;
    var h = 500;
    var padding = {
      top: 10,
      left: 20,
      right: 30,
      bottom: 40
    };
    var dataset = [
      {
        value: 10,
        label: 'foo',
        color: '#FF0000',
        active: false
      },
      {
        value: 20,
        label: 'bar',
        color: '#00FF00',
        active: false
      }
    ];

    //create the initial graph state
    drawPieGraph(rootNode, w, h, padding, dataset);

    //inspect the output
    expect(rootNode.childNodes.length).toEqual(1);

    //svg
    var svgSelector = d3.select(rootNode.childNodes[0]);
    expect(svgSelector.attr('width')).toBe('550');
    expect(svgSelector.attr('height')).toBe('550');
    expect(svgSelector.attr('padding')).toBe('{"top":10,"left":20,"right":30,"bottom":40}');

    //get the super G node
    var svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    var superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(3);

    //count the slices, labels and lines
    for (var i = 0; i < 3; i++) {
      expect(superGNode.childNodes[i].childNodes.length).toEqual(dataset.length);
    }

    //change the dataset
    dataset.push({
      value: 30,
      label: 'ping',
      color: '#0000FF',
      active: false
    });
    dataset.push({
      value: 40,
      label: 'pong',
      color: '#FF00FF',
      active: false
    });

    expect(dataset.length).toEqual(4);

    //update the graph
    updatePieGraph(rootNode, dataset);

    //re-get the super G node
    svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(3);

    //re-count the slices, labels and lines
    for (var i = 0; i < 3; i++) {
      expect(superGNode.childNodes[i].childNodes.length).toEqual(dataset.length);
    }
  });

  it("Testing Bar Graph", function() {
    //create the root node
    var rootNode = document.createElement('DIV');

    //create the initial parameters
    var w = 500;
    var h = 500;
    var padding = {
      top: 10,
      left: 20,
      right: 30,
      bottom: 40,
      bar: 0
    };
    var titles = {
      x: 'xAxis',
      y: 'yAxis'
    };
    var dataset = [
      {
        value: 10,
        label: 'foo',
        active: false
      },
      {
        value: 20,
        label: 'bar',
        active: false
      }
    ];
    var colors = [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF'
    ];

    //create the initial graph state
    drawBarGraph(rootNode, w, h, padding, titles, dataset, colors);

    //inspect the output
    expect(rootNode.childNodes.length).toEqual(1);

    //svg
    var svgSelector = d3.select(rootNode.childNodes[0]);
    //NOTE: bar graph has 12 pixels internal padding
    expect(svgSelector.attr('width')).toBe('562');
    expect(svgSelector.attr('height')).toBe('562');
    expect(svgSelector.attr('padding')).toBe('{"top":10,"left":20,"right":30,"bottom":40,"bar":0}');

    //get the super G node
    var svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    var superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(7);

    //roll call, in order
    expect(d3.select(superGNode.childNodes[0]).attr('class')).toBe('bars');
    expect(d3.select(superGNode.childNodes[1]).attr('class')).toBe('tooltips');
    expect(d3.select(superGNode.childNodes[2]).attr('class')).toBe('labels');
    expect(d3.select(superGNode.childNodes[3]).attr('class')).toBe('axis');
    expect(d3.select(superGNode.childNodes[4]).attr('class')).toBe('dashline');
    expect(d3.select(superGNode.childNodes[5]).attr('class')).toBe('titles');
    expect(d3.select(superGNode.childNodes[6]).attr('class')).toBe('xaxis');

    //count the number of bars, tooltips and labels
    expect(superGNode.childNodes[0].childNodes.length).toEqual(dataset.length);
    expect(superGNode.childNodes[1].childNodes.length).toEqual(dataset.length);
    expect(superGNode.childNodes[2].childNodes.length).toEqual(dataset.length);

    //NOTE: I could do stuff like check the heights of the bars, etc. but that's beyond the scope of this task

    //check the tooltips match the value of data
    var tooltips = superGNode.childNodes[1];
    for (var i = 0; i < dataset.length; i++) {
      expect(tooltips.childNodes[i].textContent).toBe(dataset[i].value.toString(10));
    }

    //change the dataset
    dataset.push({
      value: 30,
      label: 'ping',
      color: '#0000FF',
      active: false
    });
    dataset.push({
      value: 40,
      label: 'pong',
      color: '#FF00FF',
      active: false
    });

    expect(dataset.length).toEqual(4);

    updateBarGraph(rootNode, dataset);

    //re-get the super G node
    svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(7);

    //re-count the number of bars, tooltips and labels
    expect(superGNode.childNodes[0].childNodes.length).toEqual(dataset.length);
    expect(superGNode.childNodes[1].childNodes.length).toEqual(dataset.length);
    expect(superGNode.childNodes[2].childNodes.length).toEqual(dataset.length);

    //re-check the tooltips match the value of data
    var tooltips = superGNode.childNodes[1];
    for (var i = 0; i < dataset.length; i++) {
      expect(tooltips.childNodes[i].textContent).toBe(dataset[i].value.toString(10));
    }
  });

  it("Testing Graph Legend", function() {
    //create the root node
    var rootNode = document.createElement('DIV');

    //create the initial parameters
    var w = 500;
    var h = 500;
    var padding = {
      top: 10,
      left: 20,
      right: 30,
      bottom: 40
    };
    var shift = {
      horizontal: 8,
      vertical: 13
    };
    var dataset = [
      {
        symbol: '#FF0000',
        label: 'foo',
        active: false
      },
      {
        symbol: '#00FF00',
        label: 'bar',
        active: false
      }
    ];

    //create the initial graph state
    drawGraphLegend(rootNode, w, h, padding, shift, dataset);

    //inspect the output
    expect(rootNode.childNodes.length).toEqual(1);

    //svg
    var svgSelector = d3.select(rootNode.childNodes[0]);
    expect(svgSelector.attr('width')).toBe('550');
    expect(svgSelector.attr('height')).toBe('550');
    expect(svgSelector.attr('padding')).toBe('{"top":10,"left":20,"right":30,"bottom":40}');

    //get the super G node
    var svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    var superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(3);

    //count the backgrounds, labels and symbols
    for (var i = 0; i < 3; i++) {
      expect(superGNode.childNodes[i].childNodes.length).toEqual(dataset.length);
    }

    //drop a line in
    var lineSymbol = {
      symbol: 'line',
      stroke: 'black',
      strokeWidth: 2,
      meta: 'stroke-array',
      value: '5,5'
    };

    //change the dataset
    dataset.push({
      symbol: lineSymbol,
      label: 'ping',
      active: false
    });
    dataset.push({
      symbol: '#FF00FF',
      label: 'pong',
      active: false
    });

    expect(dataset.length).toEqual(4);

    //update the graph
    updateGraphLegend(rootNode, dataset);

    //re-get the super G node
    svgNode = rootNode.childNodes[0];
    expect(svgNode.childNodes.length).toEqual(1);
    superGNode = svgNode.childNodes[0];
    expect(superGNode.childNodes.length).toEqual(3);

    //count the backgrounds, labels and symbols
    for (var i = 0; i < 3; i++) {
      expect(superGNode.childNodes[i].childNodes.length).toEqual(dataset.length);
    }

    //walk the line
    var lineNode = superGNode.childNodes[2].childNodes[3];
    expect(lineNode.tagName).toBe('line');
    expect(d3.select(lineNode).attr('stroke-dasharray')).toBe('5,5');
  });
});
