import { useMemo, useState } from "react"
import { Svgs } from "./Svg"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export function Profile({ user }) {
    // Get the global list of posts from the Redux store
    const { posts: allPosts } = useSelector(state => state.postModule)

    // Calculate posts that belong to this user
    const galleryPosts = useMemo(() => {
        // Ensure user is defined before accessing its properties
        if (!user) return []
        return allPosts.filter(post => post.by._id === user._id)
    }, [allPosts, user]) // Dependency on user object is enough

    // Use nullish coalescing for safety (already done, but re-confirming)
    const followers = user?.followers || []
    const following = user?.following || []
    const savedPostIds = user?.savedPostIds || []

    // State to manage which tab is active ('posts' or 'saved')
    const [activeTab, setActiveTab] = useState('posts')

    if (!user) return <div>Loading Profile...</div> // Safety check

    const renderGallery = () => {
        let postsToDisplay = []

        if (activeTab === 'posts') {
            postsToDisplay = galleryPosts
        } else if (activeTab === 'saved') {
            // FILTER GLOBAL POSTS by savedPostIds
            postsToDisplay = allPosts.filter(post => savedPostIds.includes(post._id))
        }

        // Render a message if there are no posts to display
        if (postsToDisplay.length === 0) {
            return (
                <div className="no-posts-message">
                    {activeTab === 'posts'
                        ? "This user hasn't posted anything yet."
                        : "No saved posts."}
                </div>
            )
        }

        return (
            <div className="post-grid">
                {postsToDisplay.map((post, idx) => (
                    <Link
                        key={post._id || post.id || `${user._id}-p-${idx}`}
                        to={`/post/${post._id || post.id || ''}`}
                        // state is used to return to the profile page after closing the modal
                        state={{ background: { pathname: `/${user._id}` } }}
                        className="post-item"
                    >
                        <img
                            src={post.thumbnailUrl || post.imgUrl}
                            className="post-thumbnail"
                            loading="lazy"
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
                    <h2 className="profile-name">{user.username || user.fullname}</h2>

                    <div className="profile-stats">
                        {/* Posts */}
                        <span>
                            <b>{galleryPosts.length}</b>
                            {galleryPosts.length === 1 ? " post" : " posts"}
                        </span>
                        {/* Followers */}
                        <span>
                            <b>{followers.length}</b>
                            {followers.length === 1 ? " follower" : " followers"}
                        </span>
                        {/* Following */}
                        <span>
                            <b>{following.length}</b>
                            {following.length === 1 ? " following" : " following"}
                        </span>
                    </div>

                    <div className="profile-description">
                        {/* Use fullname as a description header */}
                        <p className="full-name-header">{user.fullname}</p>
                        {/* Add a placeholder for a bio */}
                        <p className="bio-text">Welcome to my profile! Explorer of beautiful sights.</p>
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

                    {/* Only show the saved tab if the currently viewed profile belongs to the logged-in user (optional UX improvement) */}
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