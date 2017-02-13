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
    drawBarGraph(
      ref,
      500,
      300,
      {
        top: 10,
        left: 30,
        right: 20,
        bottom: 20
      },
      10,
      "Age Ranges",
      "Number of People in Each Range"
    );
  }

  renderBarLegend(ref) {
    drawGraphLegend(
      ref,
      150,
      16,
      {
        top: 0,
        left: 0,
        right: 150 * 2,
        bottom: 0
      },
      {
        horizontal: 150,
        vertical: 0
      },
      "left",
      symbols,
      ['Above Average', 'Below Average', 'Average'],
      function(i) { console.log("bargraph connective tissue"); }
    );
  }

  update() {
    var ageGroups = [0,0,0,0];

    //determine the age ranges for all members of state
    this.props.state.map(function(x) {
      var age = this.parseDate(x.birthdate);

      if (age <= 20) {
        ageGroups[0]++;
      }
      else if (age <= 40) {
        ageGroups[1]++;
      }
      else if (age <= 60) {
        ageGroups[2]++;
      }
      else {
        ageGroups[3]++;
      }
    }.bind(this));

    var average = ageGroups.reduce((a,b) => { return a+b; }) / ageGroups.length;

    //update the graph
    updateBarGraph(
      d3.select("#bargraph").node(),
      -1,
      -1,
      -1,
      ageGroups,
      ['<20', '21-40', '41-60', '61+'],
      ['#FF0000', '#0000FF', '#440000', '#000044']
    );

    //update the legend
    updateGraphLegend(
      d3.select("#barlegend").node(),
      symbols,
      ['Above Average', 'Below Average', 'Average: ' + average],
      function(clicked) {
        var barGraphSVG = d3.select("#bargraph").select("svg");
        for (var i = 0; i < ageGroups.length; i++) {
          var group = ageGroups[i] < average;
          if (group == clicked) {
            toggleBar(barGraphSVG, i, true);
          }
        }
      }
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

  componentWillReceiveProps() {
    this.update();
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
