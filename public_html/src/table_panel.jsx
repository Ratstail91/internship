import React from 'react';
import { connect } from 'react-redux';
import { Card, Header, Table } from 'semantic-ui-react';

import { refreshDatabase } from './actions.jsx';

var headRow;

class TablePanel extends React.Component {
  constructor(props) {
    super(props);

    this.headerOnClick = this.headerOnClick.bind(this);

    //build the header row
    headRow = (
      <Table.Row className="paddingSmall">
        <Table.HeaderCell onClick={() => { this.headerOnClick("fname", "text") }}>First Name</Table.HeaderCell>
        <Table.HeaderCell onClick={() => { this.headerOnClick("lname", "text") }}>Last Name</Table.HeaderCell>
        <Table.HeaderCell onClick={() => { this.headerOnClick("email", "text") }}>Email</Table.HeaderCell>
        <Table.HeaderCell onClick={() => { this.headerOnClick("birthdate", "text") }}>Age</Table.HeaderCell>
        <Table.HeaderCell onClick={() => { this.headerOnClick("income","integer") }}>Income</Table.HeaderCell>
      </Table.Row>
    );

    this.state = {
      sorted: false,
      ascend: false,
      column: -1,
      method: -1
    };
  }

  componentWillMount() {
    this.props.refreshDatabase();
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

  headerOnClick(fieldName, sortMethod) {
    //BUG: the age field is sorted backwards, since it uses text

    //update the state (info for the sort)
    this.setState({
      sorted: true,
      ascend: !this.state.ascend,
      column: fieldName,
      method: sortMethod
    });
  }

  render() {
    //make a new state
    var sortedState = [...this.props.state];

    if (this.state.sorted) {
      //actually sort the damn thing
      sortedState.sort(function(a, b) {
        switch(this.state.method) {
          case "text":
            var strcmp = function(l, r) { return (l<r?-1:(l>r?1:0)); };
            var result = strcmp(a[this.state.column], b[this.state.column]);
            return this.state.ascend ? -result : result;
          case "integer":
            var result = a[this.state.column] - b[this.state.column];
            return this.state.ascend ? -result : result;
        }
      }.bind(this));
    }

    //build the body
    var arr = [];
    for (var i = 0; i < sortedState.length; i++) {
      var row = sortedState[i];
      arr.push(
       <Table.Row className="paddingSmall">
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
      <Card fluid centered={true} style={{height: "100%"}}>
      <Card.Content>

        <Header as='h2' className="textMedium">
          <Header.Content>Number of Rows Found: {arr.length}</Header.Content>
        </Header>

        <div className="scrollable">
          <Table celled id="entrylist" unstackable={true} className="textMedium">
            <Table.Header>{headRow}</Table.Header>
            <Table.Body>{arr}</Table.Body>
          </Table>
        </div>

      </Card.Content>
      </Card>
    );
  }
}

TablePanel.contextTypes = {
  store: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshDatabase: () => { dispatch(refreshDatabase()); }
  };
}

TablePanel = connect(mapStateToProps, mapDispatchToProps)(TablePanel);

export default TablePanel;
