import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

import { SOURCE_LOCAL } from './actions.js';

class PieGraphPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { slices: [], duration: 0, hoverTrigger: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.update(nextProps, nextState);
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

  mouseOverSlice(i) {
    var slices = JSON.parse(JSON.stringify(this.state.slices));
    slices[i].active = true;
    this.setState({ slices: slices, duration: 300, hoverTrigger: true });
  }

  mouseOutSlice(i) {
    var slices = JSON.parse(JSON.stringify(this.state.slices));
    slices[i].active = false;
    this.setState({ slices: slices, duration: 300, hoverTrigger: true });
  }

  update(nextProps, nextState) {
    //build the given fields
    var dataset = [
      { id: 0, value: 0, label: '', color: '#FF0000', legendLabel: '$0 - $18,200' },
      { id: 1, value: 0, label: '', color: '#00FF00', legendLabel: '$18,201 - $37,000' },
      { id: 2, value: 0, label: '', color: '#0000FF', legendLabel: '$37,001 - $80,000' },
      { id: 3, value: 0, label: '', color: '#FF00FF', legendLabel: '$80,001+' },
    ];

    //"construct" the state, if needed
    while(nextState.slices.length < dataset.length) {
      nextState.slices.push({ active: false });
    }

    //inject the callbacks
    dataset.map(function(x) {
      x.mouseOver = this.mouseOverSlice.bind(this);
      x.mouseOut = this.mouseOutSlice.bind(this);
    }.bind(this));

    //color and symbol are the same
    dataset.map(function(x) { x.symbol = x.color; });

    //insert the active value
    dataset.map(function(x) { x.active = nextState.slices[dataset.indexOf(x)].active; }.bind(this));

    //determine the income ranges for all members of nextProps.state
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

    //remove empty entries
    dataset = dataset.filter(function(x) { return x.value != 0; });

    //update pie graph
    updatePieGraph(d3.select("#piegraph").node(), dataset, nextState.duration);

    //move the legendLabel field to label
    dataset.map(function(x) { x.label = x.legendLabel; });

    //update the graph legend
    updateGraphLegend(d3.select("#pielegend").node(), dataset);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hoverTrigger) {
      this.setState({ duration: 1000, hoverTrigger: false });
    }
    this.update(nextProps, this.state);
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
