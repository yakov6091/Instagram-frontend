import { use, useState } from "react"
import { StoryList } from "./StoryList"
import { Svgs } from "./Svg"
import { story, user } from '../../data/story.js'

export function Profile() {
    const [galleryPosts, setGalleryPosts] = useState([])
    const [imgFile, setImgFile] = useState(null)
    const [caption, setCaption] = useState('')

    // Get the userDetailsdetails from the story object
    const userDetails = story.by

    function handleImgChange(ev) {
        const file = ev.target.files[0]
        // console.log(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImgFile(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

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
                        <span><b>{0}</b> followers</span>
                        <span><b>{0}</b> following</span>
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

                <form className="add-post-form" onSubmit={handleAddPost} style={{ margin: "16px 0" }}>
                    <input type="file" accept="image/*" onChange={handleImgChange} />
                    <input
                        type="text"
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={ev => setCaption(ev.target.value)}
                    />
                    <button type="submit">Post</button>
                </form>

                <StoryList stories={galleryPosts} />
            </div>
        </section>
    )

}