import { combineReducers } from "redux";

const ADD_CODE = "add some code";
const addCode = code => ({ type: ADD_CODE, code });

const initialState = {
  code: ""
};

const code = (state = initialState.code, action) => {
  switch (action.type) {
    case ADD_CODE:
      return action.code;
    default:
      return state;
  }
};

export { addCode };

export default combineReducers({
  code
});
