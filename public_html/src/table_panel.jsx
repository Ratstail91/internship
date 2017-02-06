import React from 'react';
import { Table } from 'semantic-ui-react';

import { refreshDatabase } from './actions.js';

class TablePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  //buggy
  parseDate(date) {
    date = date.split('-');
    date = new Date(date[0], date[1]-1, date[2]);

    var today = new Date();
    return today.getFullYear() - date.getFullYear();
  }

  componentWillMount() {
    this.unsubscribe = this.context.store.subscribe(function() {
      this.forceUpdate();
    }.bind(this));

    this.context.store.dispatch(refreshDatabase());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    //build the header row
    var headrow = (
      <Table.Header>
        <Table.Row className="padding small">
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell data-tsorter='numeric'>Age</Table.HeaderCell>
          <Table.HeaderCell data-tsorter='numeric'>Income</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );

    //build the body
    var arr = [];
    for (var i = 0; i < this.context.store.getState().length; i++) {
      var row = this.context.store.getState()[i];
      arr.push(
       <Table.Row className="padding small">
          <Table.Cell>{row.fname}</Table.Cell>
          <Table.Cell>{row.lname}</Table.Cell>
          <Table.Cell>{row.email}</Table.Cell>
          <Table.Cell>{row.birthdate}</Table.Cell>
          <Table.Cell>{row.income}</Table.Cell>
        </Table.Row>
      );
    }

    //finally, compile the table
    return (
      <div id="datatable" className="ui eleven wide column left aligned card">
        <h2 id="rowcount" className="padding text medium">Number of rows Found: {arr.length}</h2>
        <div className="scrollable">
          <Table celled id="entrylist" className="sortable unstackable text medium">
            {headrow}
            <Table.Body>{arr}</Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

TablePanel.contextTypes = {
  store: React.PropTypes.object
};

export default TablePanel;
