import { ADD_USER_LOCAL, CLEAR_STORE } from './actions.js';

const initialState = [];

//the reducers should remain pure
export function reduce(state = initialState, action) {
  switch(action.type) {
    case ADD_USER_LOCAL:
      return [
        ...state,
        {
          fname: action.fname,
          lname: action.lname,
          email: action.email,
          birthdate: action.birthdate,
          income: action.income,
          source: action.source
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
