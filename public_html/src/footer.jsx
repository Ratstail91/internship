import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer style={{display: "flex", flex: "1", justifyContent: "center", alignItems: "flex-end"}}>
        <p className="text small">Copyright {this.props.copyright} {this.props.copyrightYear}</p>
      </footer>
    );
  }
}

export default Footer;
