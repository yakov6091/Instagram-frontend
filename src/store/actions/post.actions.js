import { postService } from '../../../services/postService.js'
import {
    ADD_POST,
    REMOVE_POST,
    UPDATE_POST,
    SET_POSTS,
    SET_IS_LOADING,
    TOGGLE_POST_LIKE,
    ADD_POST_COMMENT,
} from '../reducers/post.reducer.js'
import { store } from '../store'
import { ADD_POST_TO_USER } from '../reducers/user.reducer.js'

// --------------------------------------------------
// Load posts with optional filters
// --------------------------------------------------
export async function loadPosts(filterBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const posts = await postService.query(filterBy)
        store.dispatch({ type: SET_POSTS, posts })
    } catch (err) {
        console.error('Post action -> Cannot load posts', err)
        throw err
    } finally {
        setTimeout(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        }, 350)
    }
}

// --------------------------------------------------
// Remove a post
// --------------------------------------------------
export async function removePost(postId) {
    try {
        await postService.remove(postId)
        store.dispatch({ type: REMOVE_POST, postId })
    } catch (err) {
        console.error('Post action -> Cannot remove post', err)
        throw err
    }
}

// --------------------------------------------------
// Save (add or update) a post
// --------------------------------------------------
export async function savePost(post) {
    const type = post._id ? UPDATE_POST : ADD_POST
    try {
        const savedPost = await postService.save(post)
        store.dispatch({ type, post: savedPost })

        if (!post._id) {
            const miniPost = {
                _id: savedPost._id,
                thumbnailUrl: savedPost.imgUrl,
            }
            store.dispatch({ type: ADD_POST_TO_USER, miniPost })
        }

        return savedPost
    } catch (err) {
        console.error('Post action -> Cannot save post', err)
        throw err
    }
}

// --------------------------------------------------
// Toggle like on a post (optimistic update)
// --------------------------------------------------
export async function togglePostLike(postId, userId, user) { // FIXED: Removed Thunk signature
    // Optimistic dispatch
    store.dispatch({ type: TOGGLE_POST_LIKE, postId, user })

    try {
        // You must await the service call to ensure data is saved
        await postService.toggleLike(postId, userId)
    } catch (err) {
        console.error('Post action -> Cannot toggle like on service', err)
        // Optional Rollback: If service fails, dispatch again to revert the like/unlike change
        // store.dispatch({ type: TOGGLE_POST_LIKE, postId, user }) 
        throw err
    }
}


export async function addPostComment(postId, comment) { // FIXED: Made function async
    // Add the comment optimistically
    store.dispatch({ type: ADD_POST_COMMENT, postId, comment })

    try {
        // Try saving to the backend
        await postService.addComment(postId, comment)
    } catch (err) {
        console.error('Post action -> Cannot save comment', err)

        // Rollback: remove the comment from the UI if save fails
        store.dispatch({
            type: 'REMOVE_POST_COMMENT', // Ensure this type is defined in your reducer
            postId,
            commentId: comment._id, // assuming comment has an _id or temp ID
        })
        throw err
    }
}