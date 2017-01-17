import React from 'react';
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
      <div id="formlist" className="superleft bordered ui form">

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Email:</p>
          </div>
          <div className="formlistRight">
            <input type="email" id="email" value={this.state.email} onChange={this.updateEmail.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>First Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id="fname" value={this.state.fname} onChange={this.updateFirstName.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Last Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id="lname" value={this.state.lname} onChange={this.updateLastName.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Date of Birth:</p>
          </div>
          <div className="formlistRight">
            <input type="date" id="birthdate" value={this.state.birthdate} onChange={this.updateBirthdate.bind(this)} placeholder="YYYY-MM-DD" />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Annual Income:</p>
          </div>
          <div className="formlistRight">
            <input type="number" id="income" value={this.state.income} onChange={this.updateIncome.bind(this)} />
          </div>
        </div>

        <div className="formlistRight">
          <button type="submit" onClick={this.myClick.bind(this)}>Submit</button>
        </div>
      </div>
    );
  }
}

export default FormList;
