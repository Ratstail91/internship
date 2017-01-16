import React from 'react';

import { addUser } from './actions.js';

var unsubscribe;

class Table extends React.Component {
  constructor(props) {
    super(props);

    unsubscribe = props.store.subscribe(function() {
      this.forceUpdate();
    }.bind(this));
  }

  //buggy
  parseDate(date) {
    date = date.split('-');
    date = new Date(date[0], date[1]-1, date[2]);

    var today = new Date();
    return today.getFullYear() - date.getFullYear();
  }

  refreshDatabase(async = false) {
    //new request
    var request = new XMLHttpRequest();

    //callback
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        //save the given entries
        var arr = JSON.parse(request.responseText);

        for (var i = 0; i < arr.length; i++) {
          var x = arr[i];
          this.props.store.dispatch(addUser(x.fname, x.lname, x.email, x.birthdate, x.income));
        };
      }

      //debugging
      if (request.readyState === 4 && request.status !== 200) {
        console.log('Status:', request.status, request.responseText);
      }
    }.bind(this);

    //finally, send the request
    request.open('GET', '/refresh.cgi', async);
    request.send();
  }

  componentWillMount() {
    this.refreshDatabase();
  }

  render() {
    //build the header row
    var headrow = (
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th data-tsorter='numeric'>Age</th>
          <th data-tsorter='numeric'>Income</th>
        </tr>
      </thead>
    );

    //build the body
    var arr = [];
    for (var i = 0; i < this.props.store.getState().length; i++) {
      var row = this.props.store.getState()[i];
      arr.push(
       <tr>
          <td>{row.fname}</td>
          <td>{row.lname}</td>
          <td>{row.email}</td>
          <td>{row.birthdate}</td>
          <td>{row.income}</td>
        </tr>
      );
    }

    //finally, compile the table
    return (
      <div id="datatable">
        <h2 id="rowcount">Number of rows Found: {arr.length}</h2>
        <div className="scrollable">
          <table id="entrylist" className="sortable">
            {headrow}
            <tbody>{arr}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;