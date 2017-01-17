import React from 'react';

import { refreshDatabase } from './actions.js';

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

  componentWillMount() {
    this.props.store.dispatch(refreshDatabase());
  }

  render() {
    //build the header row
    var headrow = (
      <thead>
        <tr>
          <th className="padding small">First Name</th>
          <th className="padding small">Last Name</th>
          <th className="padding small">Email</th>
          <th className="padding small" data-tsorter='numeric'>Age</th>
          <th className="padding small" data-tsorter='numeric'>Income</th>
        </tr>
      </thead>
    );

    //build the body
    var arr = [];
    for (var i = 0; i < this.props.store.getState().length; i++) {
      var row = this.props.store.getState()[i];
      arr.push(
       <tr>
          <td className="padding small">{row.fname}</td>
          <td className="padding small">{row.lname}</td>
          <td className="padding small">{row.email}</td>
          <td className="padding small">{row.birthdate}</td>
          <td className="padding small">{row.income}</td>
        </tr>
      );
    }

    //finally, compile the table
    return (
      <div id="datatable" className="superright bordered">
        <h2 id="rowcount" className="text medium">Number of rows Found: {arr.length}</h2>
        <div className="scrollable">
          <table id="entrylist" className="sortable text medium">
            {headrow}
            <tbody>{arr}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
