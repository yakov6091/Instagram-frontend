import { DEMO_USER_DATA } from '../actions/user.actions'
// --- ACTION TYPE CONSTANTS ---
export const SET_USER = 'SET_USER'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'
export const TOGGLE_POST_SAVE = 'TOGGLE_POST_SAVE'
export const SET_SUGGESTED_USERS = 'SET_SUGGESTED_USERS'
export const TOGGLE_FOLLOW = 'TOGGLE_FOLLOW'


// Initial state
const initialState = {
    user: DEMO_USER_DATA,
    suggestedUsers: [],
    isLoading: false,
}
// Helper to convert array of user objects to array of IDs
const getFollowingIds = (following) => following.map(user => user._id);

// Reducer
export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        // Set the current user
        case SET_USER:
            const followingIds = getFollowingIds(action.user.following || [])
            return {
                ...state,
                user: {
                    ...action.user,
                    followingIds: followingIds, // Attach the new IDs array
                }
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

        case SET_SUGGESTED_USERS:
            return {
                ...state,
                suggestedUsers: action.suggestedUsers,
            }

        case TOGGLE_FOLLOW: {
            const { suggestedUserId } = action
            const followingIds = state.user.following || []
            const isFollowing = followingIds.includes(suggestedUserId)

            // Update the current user's followingIds (Follow/Unfollow)
            const newFollowingIds = isFollowing
                ? followingIds.filter(id => id !== suggestedUserId)
                : [...followingIds, suggestedUserId]

            // Update the suggested user's followers list for real-time appearance
            const currentUserMiniProfile = {
                _id: state.user._id,
                fullname: state.user.fullname,
                imgUrl: state.user.imgUrl
            };

            const newSuggestedUsers = state.suggestedUsers.map(user => {
                if (user._id === suggestedUserId) {
                    const isNowFollowing = !isFollowing;
                    const currentFollowers = user.followers || [];
                    let updatedFollowers;

                    if (isNowFollowing) {
                        // Add the current user to the suggested user's followers list
                        updatedFollowers = [...currentFollowers, currentUserMiniProfile];
                    } else {
                        // Remove the current user from the suggested user's followers list
                        updatedFollowers = (user.followers || []).filter(follow => follow._id !== state.user._id);
                    }
                    return { ...user, followers: updatedFollowers };
                }
                return user;
            });


            return {
                ...state,
                user: { ...state.user, followingIds: newFollowingIds },
                suggestedUsers: newSuggestedUsers,
            }
        }


        default:
            return state
    }
}
