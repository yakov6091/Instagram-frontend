import { DEMO_USER_DATA } from '../actions/user.actions'
// --- ACTION TYPE CONSTANTS ---
export const SET_USER = 'SET_USER'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'

// Initial state
const initialState = {
    user: DEMO_USER_DATA,
    isLoading: false,
}

// Reducer
export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        // Set the current user
        case SET_USER:
            return {
                ...state,
                user: action.user,
            }

        // Set loading flag
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading,
            }

        // Add a new post to the user's profile (miniPost format)
        case ADD_POST_TO_USER:
            // Ensure user exists and miniPost payload is valid
            if (!state.user || !action.miniPost) return state

            return {
                ...state,
                user: {
                    ...state.user,
                    posts: [action.miniPost, ...(state.user.posts || [])], // prepend safely
                },
            }

        default:
            return state
    }
}
