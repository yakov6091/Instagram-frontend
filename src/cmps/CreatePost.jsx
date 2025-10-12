import { postService } from "../../services/postService";
import { useState } from "react";
import { user } from '../../data/story';
import { uploadService } from '../../services/uploadService';

export function CreatePost({ onPostCreated }) {
    const [imgUrl, setimgUrl] = useState(null)
    const [caption, setCaption] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    async function handleImgChange(ev) {
        setIsUploading(true);
        try {
            const imgData = await uploadService.uploadImg(ev);
            setimgUrl(imgData.secure_url); // ✅ Use Cloudinary image URL
        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setIsUploading(false);
        }
    }

    async function handleAddPost(ev) {
        ev.preventDefault();
        if (!imgUrl) return;

        setIsPosting(true)

        try {
            // Always use the current user info here
            const newPost = {
                imgUrl, // Cloudinary URL
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

            setimgUrl(null);
            setCaption('');
        } catch (err) {
            console.error("Failed to save post:", err)
            setIsPosting(false)
        }
    }

    return (
        <form className="create-post-form" onSubmit={handleAddPost}>
            <input type="file" accept="image/*" onChange={handleImgChange} />
            {isUploading && <p>Uploading image...</p>}
            {imgUrl && <img src={imgUrl} className="preview-img" alt="Preview" />}

            <input
                type="text"
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
            />

            <button type="submit">Post</button>

        </form>
    );
}