import React from 'react';

class FormList extends React.Component {
  constructor(props) {
    super(props);
  }

  clearInput() {
    this.setState({
      email: <input type="email" id={this.props.email} />,
      fname: <input type="text" id={this.props.fname} />,
      lname: <input type="text" id={this.props.lname} />,
      birthdate: <input type="date" id={this.props.birthdate} />,
      income: <input type="number" id={this.props.income} />
    });
  }

  myClick() {
    pushToDatabase();
    this.props.callHook();
    this.clearInput();
  }

  componentWillMount() {
    this.clearInput();
  }

  render() {
    return (
      <div id="formlist">

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Email:</p>
          </div>
          <div className="formlistRight">
            {this.state.email}
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>First Name:</p>
          </div>
          <div className="formlistRight">
            {this.state.fname}
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Last Name:</p>
          </div>
          <div className="formlistRight">
            {this.state.lname}
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Date of Birth:</p>
          </div>
          <div className="formlistRight">
            {this.state.birthdate}
          </div>
        </div>

        <div className="innerformlist">
          <div className="formlistLeft">
            <p>Annual Income:</p>
          </div>
          <div className="formlistRight">
            {this.state.income}
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
