import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

import { drawBarGraph, updateBarGraph } from '../scripts/bar_graph.js';
import { drawGraphLegend, updateGraphLegend } from '../scripts/graph_legend.js';
import { SOURCE_LOCAL } from './actions.js';

var symbols = [
  '#0000FF',
  '#FF0000',
  {
    symbol: "line",
    stroke: "black",
    strokeWidth: 2,
    meta: "stroke-array",
    value: "5,5"
  }
];

class BarGraphPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { bars: [], legend: [false, false], duration: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.update(nextProps, nextState);
    return false;
  }

  renderBarGraph(ref) {
    var margins = 70; //leave margins for the card borders, etc.
    var width = window.innerWidth > 500 + 50 + margins ? 500 : window.innerWidth - 50 - margins;

    drawBarGraph(
      ref,
      width,
      300,
      {
        top: 10,
        left: 30,
        right: 20,
        bottom: 20,
        bar: 1
      },
      {
        x: "Age Ranges",
        y: "Number of People in Each Range"
      },
      [],
      ['#FF0000', '#0000FF', '#440000', '#000044']
    );
  }

  renderBarLegend(ref) {
    var shift;
    var width;
    var height;

    if (window.innerWidth < 550) {
      shift = { horizontal: 0, vertical: 20 };
      width = 150;
      height = 60;
    }
    else {
      shift = { horizontal: 150, vertical: 0 };
      width = 450;
      height = 16;
    }

    drawGraphLegend(
      ref,
      width,
      height,
      {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      shift
    );
  }

  mouseOverBar(id) {
    var bars = JSON.parse(JSON.stringify(this.state.bars));
    if (!bars[id].locked) {
      bars[id].active = true;
    }
    this.setState({ bars: bars, duration: 300 });
  }

  mouseOutBar(id) {
    var bars = JSON.parse(JSON.stringify(this.state.bars));
    if (!bars[id].locked) {
      bars[id].active = false;
    }
    this.setState({ bars: bars, duration: 300 });
  }

  update(nextProps, nextState) {
    //build the given fields
    var dataset = [
      { id: 0, value: 0, label: '<20' },
      { id: 1, value: 0, label: '21-40' },
      { id: 2, value: 0, label: '41-60' },
      { id: 3, value: 0, label: '61+' }
    ];

    //"construct" the state, if needed
    while(nextState.bars.length < dataset.length) {
      nextState.bars.push({ active: false, locked: false, value: 0 });
    }

    //inject the callbacks
    dataset.map(function(x) {
      x.mouseOver = this.mouseOverBar.bind(this);
      x.mouseOut = this.mouseOutBar.bind(this);
    }.bind(this));

    //insert the active value (from state to dataset)
    dataset.map(function(x) { x.active = nextState.bars[dataset.indexOf(x)].active; });

    //determine the age ranges for all members of state
    nextProps.state.map(function(x) {
      var age = this.parseDate(x.birthdate);

      if (age <= 20) {
        dataset[0].value++;
      }
      else if (age <= 40) {
        dataset[1].value++;
      }
      else if (age <= 60) {
        dataset[2].value++;
      }
      else {
        dataset[3].value++;
      }
    }.bind(this));

    //insert the value (from dataset to state)
    nextState.bars.map(function(x) { x.value = dataset[nextState.bars.indexOf(x)].value; });

    //remove entries with no members
    dataset = dataset.filter(function(x) { return x.value != 0; });

    //calc the average
    var average = dataset.reduce((a,b) => { return a+b.value; }, 0) / dataset.length;

    //callback for the legend
    var callback = function(id) {
      var legend = JSON.parse(JSON.stringify(nextState.legend));
      var bars = JSON.parse(JSON.stringify(nextState.bars));

      //toggle
      legend[id] = !legend[id];

      bars.map(function(x) {
        if ( (average > x.value) == id) {
          x.active = !x.active;
          x.locked = x.active;
        }
      });

      this.setState({ bars: bars, legend: legend });
    }.bind(this);

    //update the graph
    updateBarGraph(d3.select("#bargraph").node(), dataset, nextState.duration);

    //update the legend
    updateGraphLegend(
      d3.select("#barlegend").node(),
      [
        { id: 0, symbol: symbols[0], label: 'Above Average', callback: callback, locked: nextState.legend[0]},
        { id: 1, symbol: symbols[1], label: 'Below Average', callback: callback, locked: nextState.legend[1]},
        { id: 2, symbol: symbols[2], label: 'Average: ' + average },
      ]
    );
  }

  //fixed
  parseDate(date) {
    date = date.split('-');
    date = new Date(date[0], date[1]-1, date[2]);

    var today = new Date();
    var thisYear = 0;
    if (today.getMonth() < date.getMonth()) {
      thisYear = 1;
    }
    else if ((today.getMonth() == date.getMonth()) && today.getDate() < date.getDate()) {
      thisYear = 1;
    }

    return today.getFullYear() - date.getFullYear() - thisYear;
  }

  componentWillReceiveProps(nextProps) {
    nextProps.state.map(function(x) {
      if (x.source == SOURCE_LOCAL) {
        this.setState({ duration: 300 });
      }
    }.bind(this));
    //update via props
    this.update(nextProps, this.state);
  }

  render() {
    return (
      <Card fluid centered={true}>
      <Card.Content className="textCentered">

        <div id="bargraph" ref={this.renderBarGraph}></div>
        <div id="barlegend" ref={this.renderBarLegend}></div>

      </Card.Content>
      </Card>
    );
  }
}

BarGraphPanel.contextTypes = {
  store: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

BarGraphPanel = connect(mapStateToProps)(BarGraphPanel);

export default BarGraphPanel;
