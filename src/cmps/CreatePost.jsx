import { postService } from "../../services/postService";
import { uploadService } from "../../services/uploadService";
import { useState } from "react";
import { user } from "../../data/story";

export function CreatePost({ onPostCreated }) {
    const [imgUrl, setImgUrl] = useState(null)
    const [caption, setCaption] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)

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
            };

            const savedPost = await postService.save(newPost)
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

            {/* Custom button to trigger file input */}
            <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                disabled={isUploading || isPosting}
            >
                {isUploading ? "Uploading..." : "Browse Image"}
            </button>

            {/* Preview image */}
            {imgUrl && <img src={imgUrl} className="preview-img" alt="Preview" />}

            <input
                type="text"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />

            <button type="submit" disabled={isPosting || isUploading}>
                {isPosting ? "Posting..." : "Post"}
            </button>
        </form>
    )
}
