import React from 'react';
import { Table } from 'semantic-ui-react';

import { refreshDatabase } from './actions.js';

var unsubscribe;

class TablePanel extends React.Component {
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
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="padding small">First Name</Table.HeaderCell>
          <Table.HeaderCell className="padding small">Last Name</Table.HeaderCell>
          <Table.HeaderCell className="padding small">Email</Table.HeaderCell>
          <Table.HeaderCell className="padding small" data-tsorter='numeric'>Age</Table.HeaderCell>
          <Table.HeaderCell className="padding small" data-tsorter='numeric'>Income</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );

    //build the body
    var arr = [];
    for (var i = 0; i < this.props.store.getState().length; i++) {
      var row = this.props.store.getState()[i];
      arr.push(
       <Table.Row>
          <Table.Cell className="padding small">{row.fname}</Table.Cell>
          <Table.Cell className="padding small">{row.lname}</Table.Cell>
          <Table.Cell className="padding small">{row.email}</Table.Cell>
          <Table.Cell className="padding small">{row.birthdate}</Table.Cell>
          <Table.Cell className="padding small">{row.income}</Table.Cell>
        </Table.Row>
      );
    }

    //finally, compile the table
    return (
      <div id="datatable" className="superright ui ten wide column left aligned card">
        <h2 id="rowcount" className="padding text medium">Number of rows Found: {arr.length}</h2>
        <div className="scrollable">
          <Table celled id="entrylist" className="sortable text medium">
            {headrow}
            <Table.Body>{arr}</Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default TablePanel;
