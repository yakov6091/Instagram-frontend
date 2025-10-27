import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { loadSuggestedUsers, toggleFollow } from '../store/actions/user.actions.js';

export function UsersPreview() {
    const user = useSelector(state => state.userModule.user)
    const suggestedUsers = useSelector(state => state.userModule.suggestedUsers)

    useEffect(() => {
        if (user && suggestedUsers.length === 0) {
            loadSuggestedUsers();
        }
    }, [user, suggestedUsers.length]);

    const followingIds = user.followingIds || []

    // Filter out users the current user is already following and the current user itself.
    const usersToSuggest = suggestedUsers
        .filter(suggested => suggested._id !== user._id && !followingIds.includes(suggested._id))
        .slice(0, 5); // Show only the top 5 suggestions

    const handleFollow = (suggestedUserId) => {
        // Dispatch the action to toggle the follow state
        toggleFollow(suggestedUserId);
    };
    return (
        <section className="users-preview-container">
            {/* Logged-in User Info Row */}
            <div className="logged-user-info">
                <img className="user-avatar" src="" />
                <div className="user-details">
                    <span className="user-username">Yakov</span>
                    <span className="user-fullname">Yakov</span>
                </div>
                <button className="switch-btn">Switch</button>
            </div>

            {/* Suggestions Header */}
            <div className="suggestions-header">
                <p>Suggested for you</p>
                <button className="see-all-btn">See All</button>
            </div>

            {/* List of Suggestions */}
            <ul className="users-list">
                {usersToSuggest.map(suggestedUser => {
                    const isFollowing = followingIds.includes(suggestedUser._id)
                    // Determine suggested text
                    const suggestionText = suggestedUser.followers.length > 5
                        ? `Followed by ${suggestedUser.followers[0]?.fullname || 'a friend'}`
                        : 'Suggested for you'

                    return (
                        <li className="user-prev-item" key={suggestedUser._id}>
                            <img className="user-avatar-sm" src={suggestedUser.imgUrl} />

                            <div className="user-details">
                                <h4 className="suggestion-username">{suggestedUser.username}</h4>
                                <p className="suggestion-follow-text">{suggestionText}</p>
                            </div>
                            <button
                                className="follow-btn"
                                onClick={() => handleFollow(suggestedUser._id)}>

                                {isFollowing ? 'Following' : 'Follow'}</button>
                        </li>
                    )
                })}
            </ul>
        </section>





    )

}