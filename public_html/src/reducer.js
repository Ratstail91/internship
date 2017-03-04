import { ADD_USER_LOCAL, SORT_STORE, CLEAR_STORE } from './actions.js';

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

    case SORT_STORE:
      //copy the state
      var sortedState = [...state];

      //actually sort the damn thing
      sortedState.sort(function(a, b) {
        switch(action.columnType) {
          case "text":
            var strcmp = function(l, r) { return (l<r?-1:(l>r?1:0)); };
            var result = strcmp(a[action.columnName], b[action.columnName]);
            return action.reverse ? -result : result;
          break;

          case "integer":
            var result = a[action.columnName] - b[action.columnName];
            return action.reverse ? -result : result;
          break;
        }
      });

      //return a sorted store
      return sortedState;
    break;

    case CLEAR_STORE:
      return initialState;
    break;

    default:
      return state;
  }

  return state;
}
