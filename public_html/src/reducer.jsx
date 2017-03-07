import { ADD_USER_LOCAL, SORT_STORE, CLEAR_STORE } from './actions.jsx';

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

          case "integer":
            var result = a[action.columnName] - b[action.columnName];
            return action.reverse ? -result : result;
        }
      });

      //return a sorted store
      return sortedState;

    case CLEAR_STORE:
      return initialState;

    default:
      return state;
  }
}
