import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Button } from 'semantic-ui-react';
import { addUser } from './actions.js';

class FormPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  clearInput() {
    this.setState({
      email: '',
      fname: '',
      lname: '',
      birthdate: '',
      income: ''
    });
  }

  myClick() {
    this.props.addUser(
      this.state.fname,
      this.state.lname,
      this.state.email,
      this.state.birthdate,
      this.state.income
    );
    this.clearInput();
  }

  componentWillMount() {
    this.clearInput();
  }

  //update fields
  updateEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  updateFirstName(evt) {
    this.setState({
      fname: evt.target.value
    });
  }

  updateLastName(evt) {
    this.setState({
      lname: evt.target.value
    });
  }

  updateBirthdate(evt) {
    this.setState({
      birthdate: evt.target.value
    });
  }

  updateIncome(evt) {
    this.setState({
      income: evt.target.value
    });
  }

  //render
  render() {
    return (
      <Card fluid centered={true}>
      <Card.Content>

      <Form className="textMedium" onSubmit={(e)=>{ e.preventDefault(); this.myClick(); }}>

        <Form.Field>
          <div className="computer only">
            <p className="left aligned">Email:</p>
          </div>
          <input type="email" name="email" value={this.state.email} onChange={this.updateEmail.bind(this)} placeholder="your@email.com" />
        </Form.Field>

        <Form.Field>
          <div className="computer only">
            <p className="left aligned">First Name:</p>
          </div>
          <input type="text" name="fname" value={this.state.fname} onChange={this.updateFirstName.bind(this)} placeholder="First Name" />
        </Form.Field>

        <Form.Field>
          <div className="computer only">
            <p className="left aligned">Last Name:</p>
          </div>
          <input type="text" name="lname" value={this.state.lname} onChange={this.updateLastName.bind(this)} placeholder="Last Name" />
        </Form.Field>

        <Form.Field>
          <div className="computer only">
            <p className="left aligned">Date of Birth:</p>
          </div>
          <input type="date" name="birthdate" value={this.state.birthdate} onChange={this.updateBirthdate.bind(this)} placeholder="YYYY-MM-DD" />
        </Form.Field>

        <Form.Field>
          <div className="computer only">
            <p className="left aligned">Annual Income:</p>
          </div>
          <input type="number" name="income" value={this.state.income} onChange={this.updateIncome.bind(this)} placeholder="Income" />
        </Form.Field>

        <Form.Button className="textRight" size="massive" type="submit">Submit</Form.Button>
      </Form>

      </Card.Content>
      </Card>
    );
  }
}

FormPanel.contextTypes = {
  store: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: (fname, lname, email, birthdate, income) => { dispatch(addUser(fname, lname, email, birthdate, income)); }
  };
}

FormPanel = connect(mapStateToProps, mapDispatchToProps)(FormPanel);

export default FormPanel;
