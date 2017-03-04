import React from 'react';

class FooterPanel extends React.Component {
  render() {
    var style = {
      display: "flex",
      flex: "1",
      justifyContent: "center",
      alignItems: "flex-end",
      fontStyle: "italic"
    };

    return (
      <footer style={style}>
        <p className="textSmall">Copyright QPS Benchmarking 2016-2017</p>
      </footer>
    );
  }
}

export default FooterPanel;
