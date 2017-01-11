import React from 'react';

class FormList extends React.Component {
  constructor(props) {
    super(props);
  }

  pushToDatabase(async) {
    if (typeof async === 'undefined') {
      async = false;
    }

    //build the request
    console.log(this.state.fname);
    var formData = new FormData();
    formData.append("fname", this.state.fname);
    formData.append("lname", this.state.lname);
    formData.append("email", this.state.email);
    formData.append("birthdate", this.state.birthdate);
    formData.append("income", this.state.income);

    //send the request
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', "/entry.cgi", async);
    httpRequest.send(formData);
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
    this.pushToDatabase();
    this.props.callHook();
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
      <div id="formlist">

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Email:</p>
          </div>
          <div className="formlistRight">
            <input type="email" id={this.props.email} value={this.state.email} onChange={this.updateEmail.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>First Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id={this.props.fname} value={this.state.fname} onChange={this.updateFirstName.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Last Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id={this.props.lname} value={this.state.lname} onChange={this.updateLastName.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Date of Birth:</p>
          </div>
          <div className="formlistRight">
            <input type="date" id={this.props.birthdate} value={this.state.birthdate} onChange={this.updateBirthdate.bind(this)} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Annual Income:</p>
          </div>
          <div className="formlistRight">
            <input type="number" id={this.props.income} value={this.state.income} onChange={this.updateIncome.bind(this)} />
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
