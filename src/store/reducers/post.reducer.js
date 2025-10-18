import { postService } from '../../../services/postService'

export const SET_POSTS = 'SET_POSTS'
// export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
// export const UPDATE_POST = 'UPDATE_POST'

// export const SET_FILTER_BY = 'SET_FILTER_BY'
// export const SET_SORT_BY = 'SET_SORT_BY'
// export const SET_IS_LOADING = 'SET_IS_LOADING'
// export const SET_ERROR = 'SET_ERROR'

export const TOGGLE_POST_LIKE = 'TOGGLE_POST_LIKE'
export const ADD_COMMENT = 'ADD_COMMENT'

const initialState = {
    posts: [],
    lastPosts: [],
    // flag: {
    //     isLoading: false,
    //     error: null,
    // },
}

export function postReducer(state = initialState, action = {}) {
    let posts
    switch (action.type) {
        // Pots 
        case SET_POSTS:
            return { ...state, posts: action.posts, lastPosts: state.posts }

        case ADD_POST:
            posts = [action.post, ...state.posts]
            return { ...state, posts, lastPosts: state.posts }
        case TOGGLE_POST_LIKE:
            posts = state.posts.map(post => {
                if (post._id !== action.postId) return post

                const isLiked = post.likedBy.some(user => user._id === action.userId)
                let newLikedBy

                if (isLiked) {
                    newLikedBy = post.likedBy.filter(user => user._id !== action.userId)
                } else {
                    // Assuming userMiniProfile is provided in the action payload
                    newLikedBy = [...post.likedBy, action.userMiniProfile]
                }

                return { ...post, likedBy: newLikedBy }
            })
            return { ...state, posts }

        case ADD_COMMENT:
            posts = state.posts.map(post => {
                if (post._id === action.postId) {
                    // Assuming action.comment contains the new comment object
                    return { ...post, comments: [...post.comments, action.comment] }
                }
                return post
            })
            return { ...state, posts }

        default:
            return state
    }
}