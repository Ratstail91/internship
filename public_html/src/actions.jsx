export const ADD_USER_LOCAL = 'ADD_USER_LOCAL';
export const CLEAR_STORE = 'CLEAR_STORE';

export const SOURCE_LOCAL = 'SOURCE_LOCAL';
export const SOURCE_FOREIGN = 'SOURCE_FOREIGN';

export function addUserLocal(fname, lname, email, birthdate, income, source) {
  return {
    type: ADD_USER_LOCAL,
    fname: fname,
    lname: lname,
    email: email,
    birthdate: birthdate,
    income: income,
    source: source
  };
}

export function addUser(fname, lname, email, birthdate, income) {
  return function(dispatch) {
    //build the request
    var formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);
    formData.append("birthdate", birthdate);
    formData.append("income", income);

    //send the request
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', "/entry.cgi");

    //async add to the local list
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState !== 4) {
        return;
      }

      if (httpRequest.status === 200) {
        if (httpRequest.responseText === 'success') {
          dispatch(addUserLocal(fname, lname, email, birthdate, income, SOURCE_LOCAL));
        }

        else {
          console.log("addUser: ", httpRequest.responseText);
        }
      }
      else {
        console.log("status:". httpRequest.status);
      }
    }

    //finally, send the request
    httpRequest.send(formData);
  }
}

export function refreshDatabase() {
  return function(dispatch) {
    //new request
    var request = new XMLHttpRequest();

    //callback
    request.onreadystatechange = function() {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        //save the given entries
        var arr = JSON.parse(request.responseText);
        for (var i = 0; i < arr.length; i++) {
          var x = arr[i];
          dispatch(addUserLocal(x.fname, x.lname, x.email, x.birthdate, x.income, SOURCE_FOREIGN));
        };
      }
      else {
        console.log("status:", request.status);
      }
    }

    //finally, send the request
    request.open('GET', '/refresh.cgi');
    request.send();
  }
}

export function clearStore() {
  return {
    type: CLEAR_STORE
  };
}
