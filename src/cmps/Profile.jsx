import { use, useState } from "react"
import { PostList } from "./PostList"
import { Svgs } from "./Svg"
import { post, user } from '../../data/post.js'

export function Profile() {
    const [galleryPosts, setGalleryPosts] = useState(user.posts)

    // Get the userDetailsdetails from the post object
    const userDetails = post.by


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
                    <h2 className="profile-name">{userDetails.fullname}</h2>
                    <div className="profile-stats">
                        <span><b>{galleryPosts.length}</b>
                            {galleryPosts.length === 1 ? "post" : "posts"}
                        </span>
                        <span><b>{user.followers.length}</b>
                            {user.followers.length === 1 ? "follower" : "followers"}
                        </span>
                        <span><b>{user.followers.length}</b>
                            {user.following.length === 1 ? "following" : "followings"}
                        </span>
                    </div>
                </div>

                <div className="profile-description">
                    <p></p>
                </div>
            </div>

            <div className="profile-gallery">
                <div className="gallery-tabs">
                    <button>{Svgs.gallery}</button>
                    <button>{Svgs.save}</button>
                </div>

                {galleryPosts.length > 0 ? (
                    <div className="post-grid">
                        {galleryPosts.map(post => (
                            <div key={post._id} className="post-item">
                                <img
                                    src={post.thumbnailUrl}
                                    className="post-thumbnail"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-posts-message">No posts yet.</p>
                )}
            </div>
        </section>
    )
}