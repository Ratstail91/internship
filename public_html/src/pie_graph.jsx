import React from 'react';

var unsubscribe;

class PieGraph extends React.Component {
  constructor(props) {
    super(props);

    unsubscribe = props.store.subscribe(function() {
      //UPDATE THE GRAPH
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    //CREATE THE GRAPH
  }

  render() {
    return (
      <div id="piegraph" className="superright ui five wide column left aligned card">
      </div>
    );
  }
}

export default PieGraph;
