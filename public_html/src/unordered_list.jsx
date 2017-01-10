import React from 'react';

class UnorderedList extends React.Component {
  render() {
    return (
      <div id="datatable">
        <h2 id="rowcount"></h2>
        <div className="scrollable">
          <table id="entrylist" className="sortable"></table>
        </div>
      </div>
    );
  }
}

export default UnorderedList;
