import React from 'react';
import ReactDOM from 'react-dom';

//includes
import Header from './header.jsx';
import FormList from './form_list.jsx';
import Table from './unordered_list.jsx';
import Footer from './footer.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="super">
          <FormList className="superleft" fname="fname" lname="lname" email="email" birthdate="birthdate" income="income" />
          <Table className="superright" />
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
