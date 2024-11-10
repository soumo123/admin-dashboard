import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import noteRef from './redux/reducers/noteRef'
import accessDetailsReducer from './redux/reducers/access.reducer'



const reducer = combineReducers({
    noteRef:noteRef,
    systemaccess:accessDetailsReducer
})



const middleware = [thunk]

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;

