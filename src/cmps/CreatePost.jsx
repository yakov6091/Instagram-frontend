import { postService } from "../../services/postService";
import { uploadService } from "../../services/uploadService";
import { useState } from "react";
import { Svgs } from "./Svg";
import { useSelector } from "react-redux";
import { savePost } from "../store/actions/post.actions";

export function CreatePost({ onPostCreated }) {
    const { user } = useSelector(state => state.userModule)

    const [imgUrl, setImgUrl] = useState(null)
    const [caption, setCaption] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)

    function openFileInput() {
        if (!isUploading && !isPosting) {
            document.getElementById("fileInput").click();
        }
    }

    async function handleImgChange(ev) {
        const file = ev.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // Upload image to Cloudinary
            const res = await uploadService.uploadImg(ev)

            // Get the secure URL from Cloudinary response
            setImgUrl(res.secure_url)
        } catch (err) {
            console.error("Image upload failed:", err)
            ev.target.value = null
        } finally {
            setIsUploading(false)
        }
    }

    async function handleAddPost(ev) {
        ev.preventDefault();
        // Added user check here to ensure data exists before proceeding
        if (!imgUrl || !user) return

        setIsPosting(true);

        try {
            const newPost = {
                imgUrl,
                txt: caption,
                by: {
                    // Added safety checks for user properties
                    _id: user._id || '',
                    fullname: user.fullname || user.username || 'Anonymous',
                    username: user.username || 'anonymous',
                    imgUrl: user.imgUrl || 'https://placehold.co/50x50/333333/ffffff?text=U',
                },
                likedBy: [],
                comments: [],
                createdAt: Date.now(),
            }

            //Call the async action function directly instead of dispatching
            await savePost(newPost)

            // Cleanup happens only after successful save
            setImgUrl(null)
            setCaption("")

            if (onPostCreated) onPostCreated(newPost);

        } catch (err) {
            console.error("Failed to save post:", err)
        } finally {
            // Reset posting state regardless of success or failure
            setIsPosting(false)
        }
    }

    // Safety check for user before rendering anything dependent on it
    if (!user) return <div>Please log in to create a post.</div>;

    return (
        <form className="create-post-form" onSubmit={handleAddPost}>
            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                id="fileInput"
                style={{ display: "none" }}
            />

            <div className="modal-header">
                {/* Left/Back button is only visible when an image is selected */}
                {imgUrl && (
                    <button
                        type="button"
                        className="header-back-btn"
                        onClick={() => setImgUrl(null)} // Go back to image selection
                    >
                        {Svgs.arrowBack}
                    </button>
                )}

                <div className="title-wrapper">
                    <span className="header-title">Create new post</span>
                </div>

                {/* Right/Share button is only visible when an image is selected */}
                {imgUrl && (
                    <button
                        type="submit"
                        className="header-action-btn"
                        disabled={isPosting || isUploading}
                    >
                        Share
                    </button>
                )}
            </div>

            {!imgUrl ? (
                // A. Placeholder/Initial State (No Image Selected)
                <div className="upload-placeholder-wrapper">
                    <div className="upload-placeholder">
                        {Svgs.imgIcon}
                        <p>Drag photos and videos here</p>
                        <button
                            type="button"
                            className="select-button"
                            onClick={openFileInput}
                            disabled={isUploading || isPosting}
                        >
                            Select from computer
                        </button>
                    </div>
                </div>
            ) : (
                // Post Creation State (Image Selected - Two Columns)
                <div className="post-creation-content">
                    {/* Left Section: Image Preview */}
                    <div className="post-image-section">
                        <img src={imgUrl} className="preview-img" alt="Preview" />
                    </div>

                    {/* Right Section: User Info, Caption, Actions */}
                    <div className="post-details-section">
                        {/* User Info */}
                        <div className="user-info">
                            <img
                                src={user.imgUrl}
                                className="user-profile-img"
                            />
                            <span className="username">{user.username}</span>
                        </div>

                        <textarea
                            placeholder="Write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="caption-input"
                            rows="10"
                        />
                    </div>
                </div>
            )}
        </form>
    )
}
