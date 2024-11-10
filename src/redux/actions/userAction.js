import {ACCESS_SUCCESS,ACCESS_FAIL} from '../constants/Access.js'

export const noteRefs = (e) =>{
    return {
      type: 'SET_REFRESH',
      data: e,
    };
  }


  export const getAccessSuccess = (data) => {
    try {

        return {
            type: ACCESS_SUCCESS,
            data: data,
        };
    } catch (error) {
     console.log(error)
    }

};

export const getAccessFail = (error) => {
    return {
        type: ACCESS_FAIL,
        data: error,
    };
};