import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

//includes
import Header from './header.jsx';
import FormList from './form_list.jsx';
import TablePanel from './table.jsx';
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
      <div>
        <Header />
        <div className="ui stackable centered two column grid">
          <FormList store={store} />
          <TablePanel store={store} />
        </div>
        <Footer copyright="Kayne Ruse" copyrightYear="2016-2017" />
      </div>
    );
  }
};

//start the process
var appNode = document.createElement('DIV');
ReactDOM.render(<App />, appNode);
document.getElementById('root').appendChild(appNode);
