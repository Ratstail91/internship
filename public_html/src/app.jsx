import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

//includes
import Header from './header.jsx';
import FormList from './form_list.jsx';
import TablePanel from './table_panel.jsx';
import PieGraph from './pie_graph.jsx';
import BarGraph from './bar_graph.jsx';
import Footer from './footer.jsx';

import { reduce } from './reducer.js';

var store = createStore(
  reduce,
  applyMiddleware(thunk)
);

var sorter;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({});
  }

  //render
  render() {
    return (
      <div>
        <script type="text/javascript" src="./tsorter.js"></script>
        <Header />
        <div className="ui stackable centered two column grid">
          <FormList store={store} />
          <TablePanel store={store} />
          <PieGraph store={store} />
          <BarGraph store={store} />
        </div>
        <Footer copyright="QPS Benchmarking" copyrightYear="2016-2017" />
      </div>
    );
  }
};

//start the process
var appNode = document.createElement('DIV');
ReactDOM.render(<App />, appNode);
document.getElementById('root').appendChild(appNode);

sorter = tsorter.create('entrylist');
