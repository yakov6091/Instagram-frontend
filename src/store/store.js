// store.js
import {
    combineReducers,
    compose,
    legacy_createStore as createStore,
} from 'redux'

import { postReducer } from './reducers/post.reducer.js'
import { userReducer, SET_USER } from './reducers/user.reducer.js'
import { DEMO_USER_DATA } from './actions/user.actions.js'

// Combine reducers
const rootReducer = combineReducers({
    postModule: postReducer,
    userModule: userReducer,
})

// Enable Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Create store with thunk middleware
export const store = createStore(rootReducer, composeEnhancers())


// Immediately set the demo user

store.dispatch({ type: SET_USER, user: DEMO_USER_DATA })
window.gStore = store

