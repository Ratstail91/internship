import React from 'react';
import { Header } from 'semantic-ui-react';

class HeaderPanel extends React.Component {
  render() {
    return (
      <Header as='h1' className="textLarge textCentered paddingSmall" style={{background: "#AAF"}}>
        <Header.Content>Hello World!</Header.Content>
      </Header>
    );
  }
}

export default HeaderPanel;
