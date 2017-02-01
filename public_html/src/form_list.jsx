import React from 'react';
import { Button } from 'semantic-ui-react';
import { addUser } from './actions.js';

class FormList extends React.Component {
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
    this.props.store.dispatch(addUser(
      this.state.fname,
      this.state.lname,
      this.state.email,
      this.state.birthdate,
      this.state.income
    ));
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
      <div id="formlist" className="ui two equal width grid four wide column right aligned card">

        <div className="row">
          <div className="column computer only">
            <p className="left aligned">Email:</p>
          </div>
          <div className="column ui input">
            <input type="email" id="email" value={this.state.email} onChange={this.updateEmail.bind(this)} placeholder="your@email.com" />
          </div>
        </div>

        <div className="row">
          <div className="column computer only">
            <p className="left aligned">First Name:</p>
          </div>
          <div className="column ui input">
            <input type="text" id="fname" value={this.state.fname} onChange={this.updateFirstName.bind(this)} placeholder="First Name" />
          </div>
        </div>

        <div className="row">
          <div className="column computer only">
            <p className="left aligned">Last Name:</p>
          </div>
          <div className="column ui input">
            <input type="text" id="lname" value={this.state.lname} onChange={this.updateLastName.bind(this)} placeholder="Last Name" />
          </div>
        </div>

        <div className="row">
          <div className="column computer only">
            <p className="left aligned">Date of Birth:</p>
          </div>
          <div className="column ui input">
            <input type="date" id="birthdate" value={this.state.birthdate} onChange={this.updateBirthdate.bind(this)} placeholder="YYYY-MM-DD" />
          </div>
        </div>

        <div className="row">
          <div className="column computer only">
            <p className="left aligned">Annual Income:</p>
          </div>
          <div className="column ui input">
            <input type="number" id="income" value={this.state.income} onChange={this.updateIncome.bind(this)} placeholder="Income" />
          </div>
        </div>

        <div className="row">
          <div className="column computer only"></div>
          <div className="column">
            <Button className="massive ui button right aligned" type="submit" onClick={this.myClick.bind(this)}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormList;
