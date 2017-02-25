import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

import { SOURCE_LOCAL } from './actions.js';

class PieGraphPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  renderPieGraph(ref) {
    var margins = 70; //leave margins for the card borders, etc.
    var width = window.innerWidth > 340 + 60 + margins ? 340 : window.innerWidth - 60 - margins;

    drawPieGraph(
      ref,
      width,
      300,
      {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    );
  }

  renderPieLegend(ref) {
    drawGraphLegend(
      ref,
      160,
      80,
      {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      {
        horizontal: 0,
        vertical: 14
      }
    );
  }

  update(nextProps) {
    //the callback used to activate the slices
    var callback = function(i) {
      toggleSlice(d3.select("#piegraph").select("svg"), i, true);
      return true;
    };

    //build the given fields
    var dataset = [
      { value: 0, label: '', color: '#FF0000', symbol: '', legendLabel: '$0 - $18,200', callback: callback },
      { value: 0, label: '', color: '#00FF00', symbol: '', legendLabel: '$18,201 - $37,000', callback: callback },
      { value: 0, label: '', color: '#0000FF', symbol: '', legendLabel: '$37,001 - $80,000', callback: callback },
      { value: 0, label: '', color: '#FF00FF', symbol: '', legendLabel: '$80,000+', callback: callback },
    ];

    //color and symbol are the same
    dataset.map(function(x) { x.symbol = x.color; });

    //determine the income ranges for all members of state
    nextProps.state.map(function(x) {
      if (x.income <= 18200) {
        dataset[0].value++;
      }
      else if (x.income <= 37000) {
        dataset[1].value++;
      }
      else if (x.income <= 80000) {
        dataset[2].value++;
      }
      else {
        dataset[3].value++;
      }
    });

    //generate the labels (percentages)
    var total = dataset.reduce(function(a,b) { return a + b.value; }, 0);
    for (var i = 0; i < dataset.length; i++) {
      dataset[i].label = '' + Math.round(dataset[i].value / total * 100) + '%';
    }

    var duration = 0;

    //BUG: graphical bug when a new catagory is created
    nextProps.state.map(function(x) {
      if (x.source == SOURCE_LOCAL) {
        duration = 1000;
      }
    });

    //remove empty entries
    dataset = dataset.filter(function(x) { return x.value != 0; });

    //update pie graph
    updatePieGraph(d3.select("#piegraph").node(), dataset,  duration);

    //move the legendLabel field to label
    dataset.map(function(x) { x.label = x.legendLabel; });

    //update the graph legend
    updateGraphLegend(d3.select("#pielegend").node(), dataset);
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  }

  render() {
    var style = {
      display: "inline-block",
      verticalAlign: "middle"
    };

    return (
      <Card fluid centered={true}>
      <Card.Content className="textCentered">

        <div id="piegraph" style={style} ref={this.renderPieGraph}></div>
        <div id="pielegend" style={style} ref={this.renderPieLegend}></div>

      </Card.Content>
      </Card>
    );
  }
}

PieGraphPanel.contextTypes = {
  store: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

PieGraphPanel = connect(mapStateToProps)(PieGraphPanel);

export default PieGraphPanel;
