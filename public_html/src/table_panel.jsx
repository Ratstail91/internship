import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

import { refreshDatabase, sortStore } from './actions.js';

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

  headerOnClick(e) {
    //get this first
    var switchNames = e.target.classList.contains("ascend");

    //wipe "ascend" and "descend" classes from the DOM
    //NOTE: refs did not work, so if you have a problem with this fuck you.
    var selection;
    while((selection = document.querySelector(".ascend")) !== null) {
      selection.className = "";
    }
    while((selection = document.querySelector(".descend")) !== null) {
      selection.className = "";
    }

    //mark as sorted
    if (!switchNames) {
      e.target.className = "ascend";
    }
    else {
      e.target.className = "descend";
    }

    //shortcut
    var attr = e.target.attributes;

    //call the sort function
    this.context.store.dispatch(
      sortStore(
        attr.getNamedItem("data-name").value,
        attr.getNamedItem("data-type").value,
        !e.target.classList.contains("ascend")
      )
    );
  }

  render() {
    //build the header row
    var headrow = (
      <Table.Header>
        <Table.Row className="padding small">
          <Table.HeaderCell data-name={"fname"} data-type={"text"} onClick={this.headerOnClick.bind(this)}>First Name</Table.HeaderCell>
          <Table.HeaderCell data-name={"lname"} data-type={"text"} onClick={this.headerOnClick.bind(this)}>Last Name</Table.HeaderCell>
          <Table.HeaderCell data-name={"email"} data-type={"text"} onClick={this.headerOnClick.bind(this)}>Email</Table.HeaderCell>
          <Table.HeaderCell data-name={"birthdate"} data-type={"text"} onClick={this.headerOnClick.bind(this)}>Age</Table.HeaderCell>
          <Table.HeaderCell data-name={"income"} data-type={"integer"} onClick={this.headerOnClick.bind(this)}>Income</Table.HeaderCell>
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
