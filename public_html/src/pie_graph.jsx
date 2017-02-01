import React from 'react';
import ReactDOM from 'react-dom';

var unsubscribe;

class PieGraph extends React.Component {
  constructor(props) {
    super(props);

    unsubscribe = props.store.subscribe(function() {
      //UPDATE THE GRAPH
    }).bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
  var node = ReactDOM.findDOMNode(this);
console.log(node);

    //create the graph
/*    drawPieGraph(
      "piegraph",
      340,
      300,
      {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    );

    //create the graph legend
    drawGraphLegend(
      "pielegend",
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
*/  }

  render() {
    return (
      <div className="ui five wide column left aligned card">
        <div id="piegraph" ref={(ref) => {console.log('The ref', ref); }} className="">CHART</div>
        <div id="pielegend" className="">LEGEND</div>
      </div>
    );
  }
}

export default PieGraph;
