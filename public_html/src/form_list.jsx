import React from 'react';

class FormList extends React.Component {
  myClick() {
    pushToDatabase();
    refreshDatabase();
    clearInput();
  }

  render() {
    return (
      <div id="formlist">
        Email:<br />
        <input type="email" id={this.props.email} /><br />

        First Name:<br />
        <input type="text" id={this.props.fname} /><br />

        Last Name:<br />
        <input type="text" id={this.props.lname} /><br />

        Date of Birth:<br />
        <input type="date" id={this.props.birthdate} /><br />

        Annual Income:<br />
        <input type="number" id={this.props.income} /><br />

        <br />
        <input type="submit" value="Submit" onClick={this.myClick} />
      </div>
    );
  }
}

export default FormList;
