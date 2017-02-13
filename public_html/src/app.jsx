import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

//includes
import HeaderPanel from './header_panel.jsx';
import FormPanel from './form_panel.jsx';
import TablePanel from './table_panel.jsx';
import PieGraphPanel from './pie_graph_panel.jsx';
import BarGraphPanel from './bar_graph_panel.jsx';
import FooterPanel from './footer_panel.jsx';

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
    var style = {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    };

    return (
      <div style={style}>
        <HeaderPanel />
        <FormPanel />
        <TablePanel />
        <PieGraphPanel />
        <BarGraphPanel />
        <FooterPanel />
      </div>
    );
  }
};

//start the process
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root"));

