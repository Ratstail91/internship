import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

import { refreshDatabase } from './actions.js';

class TablePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  //fixed
  parseDate(date) {
    date = date.split('-');
    date = new Date(date[0], date[1]-1, date[2]);

    var today = new Date();
    var thisYear = 0;
    if (today.getMonth() < date.getMonth()) {
      thisYear = 1;
    }
    else if ((today.getMonth() == date.getMonth()) && today.getDate() < date.getDate()) {
      thisYear = 1;
    }

    return today.getFullYear() - date.getFullYear() - thisYear;
  }

  componentWillMount() {
    this.context.store.dispatch(refreshDatabase());
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
          <Table.Cell>{this.parseDate(row.birthdate)}</Table.Cell>
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

function mapStateToProps(state) {
  return {state};
}

TablePanel = connect(mapStateToProps)(TablePanel);

export default TablePanel;
