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

        //EMAIL
        <div class="innerformlist">
          <div class="formlistLeft">
            <p>Email:</p>
          </div>
          <div class="formlistRight">
            <input type="email" id={this.props.email} />
          </div>
        </div>

        //FIRST NAME
        <div class="innerformlist">
          <div class="formlistLeft">
            <p>First Name:</p>
          </div>
          <div class="formlistRight">
            <input type="text" id={this.props.fname} />
          </div>
        </div>

        //LAST NAME
        <div class="innerformlist">
          <div class="formlistLeft">
            <p>Last Name:</p>
          </div>
          <div class="formlistRight">
            <input type="text" id={this.props.fname} />
          </div>
        </div>

        //BIRTHDATE
        <div class="innerformlist">
          <div class="formlistLeft">
            <p>Date of Birth:</p>
          </div>
          <div class="formlistRight">
            <input type="date" id={this.props.birthdate} />
          </div>
        </div>

        //INCOME
        <div class="innerformlist">
          <div class="formlistLeft">
            <p>Annual Income:</p>
          </div>
          <div class="formlistRight">
            <input type="number" id={this.props.income} />
          </div>
        </div>

        //INPUT
        <button type="submit" onClick={this.myClick}>Submit</button>
      </div>
    );
  }
}

export default FormList;
