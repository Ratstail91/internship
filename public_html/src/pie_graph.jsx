import React from 'react';
import ReactDOM from 'react-dom';

var unsubscribe;

class PieGraph extends React.Component {
  constructor(props) {
    super(props);

    unsubscribe = props.store.subscribe(this.update.bind(this));
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
    drawGraphLegend(
      ref,
      150,
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
      "left",
      ['#FF0000', '#00FF00', '#0000FF', '#FF00FF'],
      ['$0 - $18,200', '$18,201 - $37,000', '$37,001 - $80,000', '$80,001+'],
      function(i) { toggleSlice(d3.select("#piegraph").select("svg"), i, true); }
    );
  }

  update() {
    var incomeRange = [0,0,0,0];
    var pieColorRange = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF'];

    var state = this.props.store.getState();

    //determine the income ranges for all members of state
    state.map(function(x) {
      if (x.income <= 18200) {
        incomeRange[0]++;
      }
      else if (x.income <= 37000) {
        incomeRange[1]++;
      }
      else if (x.income <= 80000) {
        incomeRange[2]++;
      }
      else {
        incomeRange[3]++;
      }
    });

    updatePieGraph(
      d3.select("#piegraph").node(),
      incomeRange,
      [
        this.calcPercentage(incomeRange, incomeRange[0]) + "%",
        this.calcPercentage(incomeRange, incomeRange[1]) + "%",
        this.calcPercentage(incomeRange, incomeRange[2]) + "%",
        this.calcPercentage(incomeRange, incomeRange[3]) + "%"
      ],
      pieColorRange
    );

//    updatePieLegend(
//      d3.select("#pielegend")
//    );
  }

  calcPercentage(integerArray, value) {
    if (integerArray.length === 0) {
      return -1;
    }

    var total = integerArray.reduce(function(a,b) { return a+b; });

    return Math.round(value / total * 100);
  }

  render() {
    var style = {
      display: "inline-block",
      verticalAlign: "middle"
    };

    return (
      <div className="ui five wide column left aligned centered card">
        <div id="piegraph" style={style} ref={this.renderPieGraph}></div>
        <div id="pielegend" style={style} ref={this.renderPieLegend}></div>
      </div>
    );
  }
}

export default PieGraph;
