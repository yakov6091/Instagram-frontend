import { postService } from '../../../services/postService'
import {
    SET_POSTS,
    ADD_POST,
    TOGGLE_POST_LIKE,
    ADD_COMMENT
} from '../reducers/post.reducer'
import { store } from '../store'

// Action Creator (Synchronous)
export async function loadPosts() {
    // const { filterBy, sortBy } = store.getState().postModule
    try {
        // Assume postService.query() fetches all posts
        const posts = await postService.query()

        // Dispatch success action
        store.dispatch({ type: SET_POSTS, posts })

    } catch (err) {
        console.error('Post action -> Cannot load posts', err)
        // store.dispatch({ type: SET_ERROR, error: 'Failed to load feed.' }) 
        throw err
    }
}

export async function savePost(post) {
    const type = ADD_POST
    try {
        const savedPost = await postService.save(post)

        // Update the global post list (feed)
        store.dispatch({ type, post: savedPost })

        // Update the user's gallery list (Requires ADD_POST_TO_USER action type)
        if (savedPost._id) {
            const miniPost = {
                _id: savedPost._id,
                thumbnailUrl: savedPost.imgUrl,
                // Add any other fields required by your user profile
            }
            store.dispatch({ type: ADD_POST_TO_USER, miniPost })
        }
        return savedPost

    } catch (err) {
        console.error('Post action -> Cannot save post', err)
        throw err
    }
}

export function togglePostLike(postId, userId, userMiniProfile) {
    // Dispatch action to update the UI immediately 
    store.dispatch({ type: TOGGLE_POST_LIKE, postId, userId, userMiniProfile })
}

export function addPostComment(postId, comment) {
    // Dispatch action to update the UI immediately
    store.dispatch({ type: ADD_COMMENT, postId, comment })
}
