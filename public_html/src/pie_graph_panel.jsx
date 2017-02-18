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
    drawPieGraph(
      ref,
      340,
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
    var callback = function(i) { toggleSlice(d3.select("#piegraph").select("svg"), i, true); return true; };

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
      },
      [
        { symbol: '#FF0000', label: '$0 - $18,200', callback: callback },
        { symbol: '#00FF00', label: '$18,201 - $37,000', callback: callback },
        { symbol: '#0000FF', label: '$37,001 - $80,000', callback: callback },
        { symbol: '#FF00FF', label: '$80,001+', callback: callback }
      ]
    );
  }

  update() {
    var dataset = [
      { value: 0, label: '', color: '#FF0000' },
      { value: 0, label: '', color: '#00FF00' },
      { value: 0, label: '', color: '#0000FF' },
      { value: 0, label: '', color: '#FF00FF' }
    ];

    //determine the income ranges for all members of state
    this.props.state.map(function(x) {
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
      dataset[i].label = '' + Math.round(dataset[i].value / total * 100) + '%'
    }

    var duration = 0;

    //BUG: graphical bug when table is sorted
    if (this.props.state.length > 0) {
      duration = this.props.state[this.props.state.length-1].source == SOURCE_LOCAL ? 1000 : 0;
    }

    updatePieGraph(d3.select("#piegraph").node(), dataset,  duration);
  }

  componentWillReceiveProps() {
    this.update();
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
