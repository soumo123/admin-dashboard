import {ACCESS_SUCCESS,ACCESS_FAIL} from '../constants/Access.js'


  
  const initialState = {
    access: {},
    error: "",
  };
  
  const accessDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case ACCESS_SUCCESS:
        return { ...state, access: action.data};
      case ACCESS_FAIL:
        return { ...state, access: action.data};
      default:
        return state;
    }
  }

  export default accessDetailsReducer;