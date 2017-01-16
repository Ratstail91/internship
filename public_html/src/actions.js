export const ADD_USER = 'ADD_USER';
export const CLEAR_STORE = 'CLEAR_STORE';

export function addUser(fname, lname, email, birthdate, income) {
  return {
    type: ADD_USER,
    fname: fname,
    lname: lname,
    email: email,
    birthdate: birthdate,
    income: income
  };
}

export function clearStore() {
  return {
    type: CLEAR_STORE
  };
}
