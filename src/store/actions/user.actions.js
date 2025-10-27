import { store } from '../store.js'
import {
    SET_USER,
    SET_IS_LOADING,
    ADD_POST_TO_USER,
    TOGGLE_POST_SAVE,
    SET_SUGGESTED_USERS,
    TOGGLE_FOLLOW,
} from '../reducers/user.reducer.js'

import { userService } from '../../../services/user.service.js'

// --- USER DATA (Simulated API Response) ---
export const DEMO_USER_DATA = {
    _id: 'u101',
    username: 'sunflower_power77',
    password: 'mukmuk',
    fullname: 'sunflower_power77 from CA.',
    imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
    posts: [
        { _id: 'p101', thumbnailUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg', isVideo: false },
    ],
    following: [
        { _id: 'u106', fullname: 'Dob', imgUrl: 'http://some-img' },
        { _id: 'u107', fullname: 'Joy', imgUrl: 'http://some-img' }
    ],
    followers: [
        { _id: 'u105', fullname: 'Bob', imgUrl: 'http://some-img' },
    ],
    likedPostIds: ['s105', 's122', 's173'],
    savedPostIds: [],
}

// --- Dummy login credentials ---
const DUMMY_LOGIN_CREDS = { username: 'sunflower_power77', password: 'mukmuk' }

// --------------------------------------------------
// Login Action
// --------------------------------------------------
export async function login(credentials = DUMMY_LOGIN_CREDS) {
    // 1. Start loading
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const user = DEMO_USER_DATA

        // 2. Dispatch user to store
        store.dispatch({ type: SET_USER, user })

        return user

    } catch (err) {
        console.error('User action -> Cannot login', err)
        throw err

    } finally {
        // 3. Stop loading
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

// Load Suggested Users Action
export function loadSuggestedUsers() {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    try {
        const suggestedUsers = userService.generateMockUsers()

        store.dispatch({
            type: SET_SUGGESTED_USERS,
            suggestedUsers,
        });

    } catch (err) {
        console.error('User action -> Cannot load suggested users', err);
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}


// Toggle Follow/Unfollow Action

export async function toggleFollow(suggestedUserId) {
    const user = store.getState().userModule.user
    if (!user) {
        console.error('toggleFollow failed: User not logged in.')
        return
    }
    try {
        // Dispatch action to immediately change state
        store.dispatch({
            type: TOGGLE_FOLLOW,
            suggestedUserId
        })

        // Simulate API call for persistence (e.g., Firebase Firestore update)
        // In a real app, you would: await userService.updateFollowStatus(user._id, suggestedUserId);

        console.log(`[LOG] Follow status toggled for user ID: ${suggestedUserId}`);

    } catch (err) {
        // Rollback (Dispatch the action again to revert the state change)
        store.dispatch({
            type: TOGGLE_FOLLOW,
            suggestedUserId
        })
        console.error(`User action -> Failed to toggle follow status for ${suggestedUserId}`, err)
    }
}

// Add a post to the user's profile
// miniPost should be in the format { _id, thumbnailUrl }
export function addPostToUser(miniPost) {
    if (!miniPost) return

    store.dispatch({
        type: ADD_POST_TO_USER,
        miniPost,
    })
}
// The isSaved flag should represent the post's CURRENT state BEFORE the toggle.
export async function togglePostSave(postId) {
    // We assume the user is already logged in and available in the store state
    const user = store.getState().userModule.user
    if (!user) {
        console.error('togglePostSave failed: User not logged in.')
        return
    }

    store.dispatch({
        type: TOGGLE_POST_SAVE,
        postId: postId,
    })

}

