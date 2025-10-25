// Action Types
export const SET_POSTS = 'SET_POSTS'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const TOGGLE_POST_LIKE = 'TOGGLE_POST_LIKE'
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT'
export const REMOVE_POST_COMMENT = 'REMOVE_POST_COMMENT'
export const TOGGLE_COMMENT_LIKE = 'TOGGLE_COMMENT_LIKE'

export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'

// Initial State
const initialState = {
    posts: [],
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
            posts = state.posts.map(post =>
                post._id === action.post._id ? action.post : post
            )
            return { ...state, posts, lastPosts: state.posts }

        case REMOVE_POST:
            posts = state.posts.filter(post => post._id !== action.postId)
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
                return {
                    ...post,
                    comments: updatedComments,
                }
            })
            return { ...state, posts }


        // FLAGS
        case SET_IS_LOADING:
            return { ...state, flag: { ...state.flag, isLoading: action.isLoading } }

        case SET_ERROR:
            return { ...state, flag: { ...state.flag, error: action.error } }

        default:
            return state
    }
}