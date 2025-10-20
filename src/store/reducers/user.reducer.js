import { DEMO_USER_DATA } from '../actions/user.actions'
// --- ACTION TYPE CONSTANTS ---
export const SET_USER = 'SET_USER'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'
export const TOGGLE_POST_SAVE = 'TOGGLE_POST_SAVE'

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
        case TOGGLE_POST_SAVE:
            // Ensure we have a user and a postId to work with
            if (!state.user || !action.postId) return state

            const postId = action.postId
            const userSavedIds = state.user.savedPostIds || [] // Get current saved IDs (default to empty array)

            let newSavedPostIds;

            // Check if the post ID is already in the saved list
            if (userSavedIds.includes(postId)) {
                // Action: UNSAVE -> Filter it out (remove)
                newSavedPostIds = userSavedIds.filter(id => id !== postId)
            } else {
                // Action: SAVE -> Add it to the list
                newSavedPostIds = [...userSavedIds, postId]
            }

            return {
                ...state,
                user: {
                    ...state.user,
                    savedPostIds: newSavedPostIds // Update the user object with the new list
                }
            }

        default:
            return state
    }
}
