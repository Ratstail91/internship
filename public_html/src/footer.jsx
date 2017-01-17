import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p className="text small">Copyright {this.props.copyright} {this.props.copyrightYear}</p>
      </footer>
    );
  }
}

export default Footer;
