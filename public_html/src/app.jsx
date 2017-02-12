import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

//includes
import HeaderPanel from './header_panel.jsx';
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
        <HeaderPanel />
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

