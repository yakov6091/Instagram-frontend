import { postService } from "../../services/postService";
import { uploadService } from "../../services/uploadService";
import { useState } from "react";
import { user } from "../../data/post";
import { Svgs } from "./Svg";
import { useDispatch } from "react-redux";
import { savePost } from "../store/actions/post.actions";

export function CreatePost({ onPostCreated }) {
    const [imgUrl, setImgUrl] = useState(null)
    const [caption, setCaption] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)

    const dispatch = useDispatch()

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

            setIsUploading(false)
        } catch (err) {
            console.error("Image upload failed:", err)
            setIsUploading(false);
            ev.target.value = null
        }
    }

    async function handleAddPost(ev) {
        ev.preventDefault();
        if (!imgUrl) return

        setIsPosting(true);

        try {
            const newPost = {
                imgUrl,
                txt: caption,
                by: {
                    _id: user._id,
                    fullname: user.username,
                    imgUrl: user.imgUrl,
                },
                likedBy: [],
                comments: [],
                createdAt: Date.now(),
            }
            const savedPost = await dispatch(savePost(newPost))

            if (onPostCreated) onPostCreated(savedPost)

            setImgUrl(null)
            setCaption("")
            setIsPosting(false)
        } catch (err) {
            console.error("Failed to save post:", err)
            setIsPosting(false)
        }
    }

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
