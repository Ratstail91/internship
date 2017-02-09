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
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <Header />
        <div className="ui stackable centered two column grid">
          <FormList />
          <TablePanel />
          <PieGraph />
          <BarGraph />
        </div>
        <Footer copyright="QPS Benchmarking" copyrightYear="2016-2017" />
      </div>
    );
  }
};

//start the process
var appNode = document.querySelector('#root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  appNode);

sorter = tsorter.create('entrylist');
