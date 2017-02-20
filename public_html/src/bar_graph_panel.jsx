import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

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
  }

  shouldComponentUpdate() {
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

  update(nextProps) {
    var dataset = [
      { value: 0, label: '<20' },
      { value: 0, label: '21-40' },
      { value: 0, label: '41-60' },
      { value: 0, label: '61+' }
    ];

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

    //remove entries with no members
    dataset = dataset.filter(function(x) { return x.value != 0; });

    //update the graph
    updateBarGraph(d3.select("#bargraph").node(), dataset);

    //update the legend
    var average = dataset.reduce((a,b) => { return a+b.value; }, 0) / dataset.length;

    var callback = function(clicked) {
      var barGraphSVG = d3.select("#bargraph").select("svg");
      for (var i = 0; i < dataset.length; i++) {
        var group = dataset[i].value < average;
        if (group == clicked) {
          toggleBar(barGraphSVG, i, true);
        }
      }
      return true;
    };

    updateGraphLegend(
      d3.select("#barlegend").node(),
      [
        { symbol: symbols[0], label: 'Above Average', callback: callback },
        { symbol: symbols[1], label: 'Below Average', callback: callback },
        { symbol: symbols[2], label: 'Average: ' + average, callback: () => { ; } },
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
    this.update(nextProps);
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
