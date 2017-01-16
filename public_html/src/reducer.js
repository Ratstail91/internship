import { ADD_USER, CLEAR_STORE } from './actions.js';

const initialState = [];

//the reducers should remain pure
export function reduce(state = initialState, action) {
  switch(action.type) {
    case ADD_USER:
      return [
        ...state,
        {
          fname: action.fname,
          lname: action.lname,
          email: action.email,
          birthdate: action.birthdate,
          income: action.income
        }];
    break;
    case CLEAR_STORE:
      return initialState;
    break;
    default:
      return state;
  }

  return state;
}
