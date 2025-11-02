import { ALL_POSTS } from '../../../services/user.service'
// Action Types
export const SET_POSTS = 'SET_POSTS'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const REPLACE_POST = 'REPLACE_POST'
export const TOGGLE_POST_LIKE = 'TOGGLE_POST_LIKE'
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT'
export const REMOVE_POST_COMMENT = 'REMOVE_POST_COMMENT'
export const TOGGLE_COMMENT_LIKE = 'TOGGLE_COMMENT_LIKE'

export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'

// Initial State
const initialState = {
    posts: ALL_POSTS,
    lastPosts: [],
    flag: {
        isLoading: false,
        error: null,
    },
}

// Reducer
export function postReducer(state = initialState, action = {}) {
    let posts
    switch (action.type) {
        // POSTS
        case SET_POSTS:
            return { ...state, posts: action.posts, lastPosts: state.posts }

        case ADD_POST:
            posts = [action.post, ...state.posts]
            return { ...state, posts, lastPosts: state.posts }

        case UPDATE_POST:
            posts = state.posts.map(post => {
                if (post._id !== action.post._id) return post
                // Preserve any existing _renderId so React keys remain stable and components don't remount
                const updated = { ...action.post }
                if (post._renderId) updated._renderId = post._renderId
                return updated
            })
            return { ...state, posts, lastPosts: state.posts }

        case REMOVE_POST:
            posts = state.posts.filter(post => post._id !== action.postId)
            return { ...state, posts, lastPosts: state.posts }

        case REPLACE_POST:
            // Replace a temporary/generated post (oldId) with a newly saved post while keeping the same position
            posts = [...state.posts]
            const idx = posts.findIndex(p => p._id === action.oldId)
            if (idx !== -1) {
                // Preserve a stable render id so React keys don't change and components won't remount
                const replaced = { ...action.post, _renderId: action.oldId }
                posts.splice(idx, 1, replaced)
            } else {
                // If not found, prepend as fallback
                posts = [{ ...action.post, _renderId: action.oldId }, ...state.posts]
            }
            return { ...state, posts, lastPosts: state.posts }

        case TOGGLE_POST_LIKE:
            // FIX: Use action.user and action.postId, as dispatched from post.actions.js
            const userToToggle = action.user
            posts = state.posts.map(post => {
                if (post._id !== action.postId) return post

                // Use the user ID from the dispatched action's user object
                const likedByUser = post.likedBy?.some(u => u._id === userToToggle._id)

                return {
                    ...post,
                    // Use 'likedBy' array (instead of 'likes' as in your original reducer)
                    likedBy: likedByUser
                        ? (post.likedBy || []).filter(u => u._id !== userToToggle._id)
                        : [...(post.likedBy || []), userToToggle], // Add the full user object
                }
            })
            return { ...state, posts }

        case ADD_POST_COMMENT:
            posts = state.posts.map(post => {
                if (post._id !== action.postId) return post
                return {
                    ...post,
                    comments: [...(post.comments || []), action.comment],
                }
            })
            return { ...state, posts }

        case REMOVE_POST_COMMENT:
            posts = state.posts.map(post => {
                if (post._id !== action.postId) return post
                return {
                    ...post,
                    comments: post.comments.filter(
                        comment => comment._id !== action.commentId
                    ),
                }
            })
            return { ...state, posts }

        case TOGGLE_COMMENT_LIKE:
            const userToToggleCommentLike = action.user
            posts = state.posts.map(post => {
                // 🏆 CRITICAL FIX: Only run the complex mapping logic on the target post.
                if (post._id !== action.postId) return post

                const updatedComments = (post.comments || []).map(comment => {
                    // Find the correct Comment within the Post
                    if (comment._id !== action.commentId) return comment
                    // Toggle the Like status on the Comment
                    const likedByUser = comment.likedBy?.some(user => user._id === userToToggleCommentLike._id)
                    return {
                        ...comment,
                        likedBy: likedByUser
                            ? (comment.likedBy || []).filter(u => u._id !== userToToggleCommentLike._id)
                            : [...(comment.likedBy || []), userToToggleCommentLike],
                    }
                })
                // Return the updated Post with the modified comments array
                return { ...post, comments: updatedComments }
            })
            return { ...state, posts } // RETURN the new state with the updated posts array

        case SET_IS_LOADING:
            return { ...state, flag: { ...state.flag, isLoading: action.isLoading } }

        case SET_ERROR:
            return { ...state, flag: { ...state.flag, error: action.error } }

        // --- DEFAULT ---
        default:
            return state

    }
}
