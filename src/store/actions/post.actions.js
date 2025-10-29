import { postService } from '../../../services/postService.js'
import {
    ADD_POST,
    REMOVE_POST,
    UPDATE_POST,
    REPLACE_POST,
    SET_POSTS,
    SET_IS_LOADING,
    TOGGLE_POST_LIKE,
    ADD_POST_COMMENT,
    REMOVE_POST_COMMENT,
    TOGGLE_COMMENT_LIKE
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
        // Merge fetched posts with any posts already in the store (e.g., suggested users' generated posts)
        const existingPosts = store.getState().postModule.posts || []
        // Merge and dedupe by _id to avoid duplicate keys
        const map = new Map()
        // Add loaded posts first
        posts.forEach(p => map.set(p._id, p))
        // Add any existing posts that aren't present in loaded posts
        existingPosts.forEach(p => { if (!map.has(p._id)) map.set(p._id, p) })
        const merged = Array.from(map.values())
        store.dispatch({ type: SET_POSTS, posts: merged })
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
export async function togglePostLike(postId, userId, user, postObj) { // FIXED: Removed Thunk signature; accepts optional postObj to persist suggested posts
    // First, ensure the post exists in the backend/storage before optimistic update
    let actualPostId = postId
    try {
        await postService.getById(postId)
    } catch (err) {
        // If post not in storage but we have the post object (e.g., suggested/generated), persist it first
        if (postObj) {
            try {
                const toSave = { ...postObj }
                // Remove temporary/generated id so storage assigns a real unique id
                delete toSave._id
                const savedPost = await postService.save(toSave)
                // Replace the temporary/generated post in the store with the newly saved post
                // Keep the same position by replacing the old temp id with savedPost
                store.dispatch({ type: REPLACE_POST, oldId: postObj._id, post: savedPost })
                actualPostId = savedPost._id
            } catch (saveErr) {
                console.error('Post action -> Cannot persist suggested post before toggling like', saveErr)
                return
            }
        } else {
            console.error('Post action -> Cannot toggle like: post not found in storage', postId)
            return
        }
    }

    // Optimistic dispatch
    store.dispatch({ type: TOGGLE_POST_LIKE, postId: actualPostId, user })

    try {
        // You must await the service call to ensure data is saved
        await postService.toggleLike(actualPostId, userId)
    } catch (err) {
        console.error('Post action -> Cannot toggle like on service', err)
        // Rollback optimistic change
        store.dispatch({ type: TOGGLE_POST_LIKE, postId: actualPostId, user })
        throw err
    }
}


export async function addPostComment(postId, comment, postObj) { // accepts optional postObj to persist suggested posts
    let actualPostId = postId
    try {
        await postService.getById(postId)
    } catch (err) {
        if (postObj) {
            try {
                const toSave = { ...postObj }
                delete toSave._id
                const savedPost = await postService.save(toSave)
                // Replace the temporary/generated post in the store with the newly saved post
                // Keep the same position by replacing the old temp id with savedPost
                store.dispatch({ type: REPLACE_POST, oldId: postObj._id, post: savedPost })
                actualPostId = savedPost._id
            } catch (saveErr) {
                console.error('Post action -> Cannot persist suggested post before adding comment', saveErr)
                return
            }
        } else {
            console.error('Post action -> Cannot save comment: post not found in storage', postId)
            return
        }
    }

    // Add the comment optimistically
    store.dispatch({ type: ADD_POST_COMMENT, postId: actualPostId, comment })

    try {
        // Try saving to the backend
        await postService.addComment(actualPostId, comment)
    } catch (err) {
        console.error('Post action -> Cannot save comment', err)

        // Rollback: remove the comment from the UI if save fails
        store.dispatch({
            type: REMOVE_POST_COMMENT,
            postId: actualPostId,
            commentId: comment._id,
        })
        throw err
    }
}

export async function toggleCommentLike(postId, commentId, userId, user) {
    // Optimistic dispatch: Update the UI immediately
    store.dispatch({ type: TOGGLE_COMMENT_LIKE, postId, commentId, user })

    try {
        await postService.toggleCommentLike(postId, commentId, userId)
    } catch (err) {
        console.error('Post action -> Cannot toggle comment like on service', err)

        throw err
    }
}