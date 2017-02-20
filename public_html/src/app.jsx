import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Grid } from 'semantic-ui-react';
import DevTools from './dev_tools.jsx';

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
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
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
        <Grid centered stackable columns={2}>
          <Grid.Row>

            <Grid.Column width={4}>
              <FormPanel />
            </Grid.Column>

            <Grid.Column width={11}>
              <TablePanel />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>

            <Grid.Column width={8}>
              <PieGraphPanel />
            </Grid.Column>

            <Grid.Column width={7}>
              <BarGraphPanel />
            </Grid.Column>

          </Grid.Row>
        </Grid>
        <FooterPanel />
      </div>
    );
  }
};

//start the process
ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.querySelector("#root"));

