import { use, useState } from "react"
import { StoryList } from "./StoryList"
import { Svgs } from "./Svg"
import { story, user } from '../../data/story.js'

export function Profile() {
    const [galleryPosts, setGalleryPosts] = useState(user.posts)
    console.log(galleryPosts)
    const [imgFile, setImgFile] = useState(null)
    const [caption, setCaption] = useState('')

    // Get the userDetailsdetails from the story object
    const userDetails = story.by

    function handleAddPost(ev) {
        ev.preventDefault()
        if (!imgFile) return

        const newPost = {
            _id: Date.now().toString(),
            imgUrl: imgFile,
            txt: caption,
            by: {
                _id: userDetails._id,
                fullname: userDetails.fullname,
                imgUrl: userDetails.imgUrl,
            },
            likedBy: [],
            comments: []
        }
        setGalleryPosts([newPost, ...galleryPosts])
        setImgFile(null)
        setCaption('')
    }

    return (
        <section className="profile-container">
            <div className="profile-header-row">
                <div className="profile-image">
                    <img
                        className="profile-img"
                        src={user.imgUrl || "https://i.imgur.com/8Km9tLL.png"}
                    />
                </div>

                <div className="profile-details">
                    <h2 className="profile-name">{userDetails.fullname}</h2>
                    <div className="profile-stats">
                        <span><b>{galleryPosts.length}</b> posts</span>
                        <span><b>{user.followers.length}</b> followers</span>
                        <span><b>{user.followers.length}</b> following</span>
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
                                    src={post.thumbnailUrl || post.imgUrl}
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