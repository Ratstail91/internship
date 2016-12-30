import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>Copyright {this.props.copyright} {this.props.copyrightYear}</p>
      </footer>
    );
  }
}

export default Footer;
