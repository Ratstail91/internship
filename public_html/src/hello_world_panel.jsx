import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

class HelloWorldPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card fluid centered={true}>
      <Card.Content>

        <p>Hello World!</p>

      </Card.Content>
      </Card>
    );
  }
}

HelloWorldPanel.contextTypes = {
  store: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

HelloWorldPanel = connect(mapStateToProps)(HelloWorldPanel);

export default HelloWorldPanel;
