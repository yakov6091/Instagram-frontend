import { useState } from "react"
import { Svgs } from "./Svg"
import { Link } from "react-router-dom"


export function Profile({ user }) {
    const galleryPosts = user?.posts || []
    const followers = user?.followers || []
    const following = user?.following || []
    const savedPostIds = user?.savedPostIds || []

    // State to manage which tab is active ('posts' or 'saved')
    const [activeTab, setActiveTab] = useState('posts')

    const renderGallery = () => {
        let postsToDisplay = []

        if (activeTab === 'posts') {
            postsToDisplay = galleryPosts
        } else if (activeTab === 'saved') {
            postsToDisplay = [] // Placeholder for saved posts logic
        }

        // if (postsToDisplay.length === 0) {
        //     return (
        //         <div className="gallery-content no-posts-container">
        //             <p className="no-posts-message">
        //                 {activeTab === 'posts'
        //                     ? "No posts yet."
        //                     : "No saved posts yet. You need a global post list to implement this fully."
        //                 }
        //             </p>
        //         </div>
        //     )
        // }

        return (
            <div className="post-grid">
                {postsToDisplay.map(post => (
                    // Link to the post details page (Crucial for modal logic)
                    <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        // This state tells the router to render the modal on top of the current route
                        state={{ background: { pathname: `/profile/${user._id}` } }}
                        className="post-item"
                    >
                        <img
                            src={post.thumbnailUrl}
                            className="post-thumbnail"
                        />
                    </Link>
                ))}
            </div>
        )
    }



    return (
        <section className="profile-container">
            <div className="profile-header-row">
                <div className="profile-image">
                    <img
                        className="profile-img"
                        src={user.imgUrl}
                    />
                </div>

                <div className="profile-details">
                    <h2 className="profile-name">{user.fullname}</h2>

                    <div className="profile-stats">
                        <span><b>{galleryPosts.length}</b>
                            {galleryPosts.length === 1 ? "post" : "posts"}
                        </span>
                        <span><b>{followers.length}</b>
                            {followers.length === 1 ? "follower" : "followers"}
                        </span>
                        <span><b>{following.length}</b>
                            {following.length === 1 ? "following" : "followings"}
                        </span>
                    </div>

                    <div className="profile-description">
                        <p>{user.fullname}</p>
                        {/* If you add a bio field to the user object, render it here */}
                    </div>
                </div>
            </div>

            <div className="profile-gallery">
                <div className="gallery-tabs">
                    <button
                        className={activeTab === 'posts' ? 'active' : ''}
                        onClick={() => setActiveTab('posts')}>
                        {Svgs.gallery}
                    </button>

                    <button
                        className={activeTab === 'saved' ? 'active' : ''}
                        onClick={() => setActiveTab('saved')}>
                        {Svgs.save}
                    </button>
                </div>

                {renderGallery()}
            </div>
        </section>
    )
}