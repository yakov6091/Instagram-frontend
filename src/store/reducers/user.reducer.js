import { DEMO_USER_DATA } from '../actions/user.actions'

// --- ACTION TYPE CONSTANTS ---
export const SET_USER = 'SET_USER'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER'
export const TOGGLE_POST_SAVE = 'TOGGLE_POST_SAVE'
export const SET_SUGGESTED_USERS = 'SET_SUGGESTED_USERS'
export const TOGGLE_FOLLOW = 'TOGGLE_FOLLOW'


// Helper to convert array of user objects to array of IDs
const getFollowingIds = (following) => (following || []).map(user => user._id);

// Initial state (FIX: Initialize followingIds on load)
const initialState = {
    user: {
        ...DEMO_USER_DATA,
        followingIds: getFollowingIds(DEMO_USER_DATA.following), // 🌟 FIX 1 APPLIED
    },
    suggestedUsers: [],
    isLoading: false,
}

// Reducer
export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        // Set the current user
        case SET_USER:
            // Recalculate IDs in case the server data changes the array structure
            const followingIdsOnSet = getFollowingIds(action.user.following)
            return {
                ...state,
                user: {
                    ...action.user,
                    followingIds: followingIdsOnSet, // Attach the IDs array
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
            if (!state.user || !action.miniPost) return state
            return {
                ...state,
                user: {
                    ...state.user,
                    posts: [action.miniPost, ...(state.user.posts || [])], // prepend safely
                },
            }

        case TOGGLE_POST_SAVE:
            if (!state.user || !action.postId) return state

            const postId = action.postId
            const userSavedIds = state.user.savedPostIds || []

            let newSavedPostIds;
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

            const following = state.user.following || []
            const followingIds = state.user.followingIds || [] // Use the pre-calculated array

            // Check membership using the IDs array
            const isFollowing = followingIds.includes(suggestedUserId)

            // Update the current user's following list (Follow/Unfollow) ---
            let newFollowing;
            let newFollowingIds;

            if (isFollowing) {
                // Unfollow: filter the object array
                newFollowing = following.filter(f => f._id !== suggestedUserId)
            } else {
                // Follow: Find and add the mini-profile object
                const followedUser = state.suggestedUsers.find(u => u._id === suggestedUserId)
                if (!followedUser) return state

                const followedUserMiniProfile = {
                    _id: followedUser._id,
                    fullname: followedUser.fullname,
                    username: followedUser.username,
                    imgUrl: followedUser.imgUrl,
                }
                newFollowing = [...following, followedUserMiniProfile]
            }

            // Always recalculate the IDs list from the new objects array
            newFollowingIds = newFollowing.map(f => f._id)


            // --- Update the suggested user's followers list
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
                        updatedFollowers = [...currentFollowers, currentUserMiniProfile];
                    } else {
                        updatedFollowers = currentFollowers.filter(follow => follow._id !== state.user._id);
                    }
                    return { ...user, followers: updatedFollowers };
                }
                return user;
            });


            return {
                ...state,
                // Update both the `following` objects array and the `followingIds` array
                user: {
                    ...state.user,
                    following: newFollowing,
                    followingIds: newFollowingIds
                },
                suggestedUsers: newSuggestedUsers,
            }
        }


        default:
            return state
    }
}
