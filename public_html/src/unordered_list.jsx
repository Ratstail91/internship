import React from 'react';

class UnorderedList extends React.Component {
  parseDate(date) {
    date = date.split('-');
    date = new Date(date[0], date[1]-1, date[2]);

    var today = new Date();
    return today.getUTCFullYear() - date.getUTCFullYear();
  }

  refreshDatabase(async) {
    if (typeof async === 'undefined') {
      async = false;
    }

    //new request
    var request = new XMLHttpRequest();

    //callback
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        //save the given something...
        this.setState(JSON.parse(request.responseText));
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
    for (var key in this.state) {
      var row = this.state[key];
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
        <h2 id="rowcount"></h2>
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

export default UnorderedList;
