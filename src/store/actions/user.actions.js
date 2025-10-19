import { store } from '../store.js'
import {
    SET_USER,
    SET_IS_LOADING,
    ADD_POST_TO_USER
} from '../reducers/user.reducer.js'

// --- USER DATA (Simulated API Response) ---
export const DEMO_USER_DATA = {
    _id: 'u101',
    username: 'sunflower_power77',
    password: 'mukmuk',
    fullname: 'sunflower_power77 from CA.',
    imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
    posts: [
        { _id: 'p101', thumbnailUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg', isVideo: false },
        { _id: 'p102', thumbnailUrl: 'https://petapixel.com/assets/uploads/2021/03/sonya1pickfeat-800x420.jpg', isVideo: false },
    ],
    following: [
        { _id: 'u106', fullname: 'Dob', imgUrl: 'http://some-img' },
    ],
    followers: [
        { _id: 'u105', fullname: 'Bob', imgUrl: 'http://some-img' },
    ],
    likedPostIds: ['s105', 's122', 's173'],
    savedPostIds: ['s104', 's111', 's423'],
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

// --------------------------------------------------
// Add a post to the user's profile
// miniPost should be in the format { _id, thumbnailUrl }
// --------------------------------------------------
export function addPostToUser(miniPost) {
    if (!miniPost) return

    store.dispatch({
        type: ADD_POST_TO_USER,
        miniPost,
    })
}
