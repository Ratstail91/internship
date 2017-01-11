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

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Email:</p>
          </div>
          <div className="formlistRight">
            <input type="email" id={this.props.email} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>First Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id={this.props.fname} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Last Name:</p>
          </div>
          <div className="formlistRight">
            <input type="text" id={this.props.lname} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Date of Birth:</p>
          </div>
          <div className="formlistRight">
            <input type="date" id={this.props.birthdate} />
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Annual Income:</p>
          </div>
          <div className="formlistRight">
            <input type="number" id={this.props.income} />
          </div>
        </div>

        <div className="formlistRight">
          <button type="submit" onClick={this.myClick}>Submit</button>
        </div>
      </div>
    );
  }
}

export default FormList;
