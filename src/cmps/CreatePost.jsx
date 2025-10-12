import { postService } from "../../services/postService";
import { useState } from "react";
import { user } from '../../data/story';

export function CreatePost({ onPostCreated }) {
    const [imgFile, setImgFile] = useState(null)
    const [caption, setCaption] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    function handleImgChange(ev) {
        const file = ev.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImgFile(reader.result)
        }
        reader.readAsDataURL(file)
    }

    async function handleAddPost(ev) {
        ev.preventDefault();
        if (!imgFile) return;

        setIsPosting(true)

        // Always use the current user info here
        const newPost = {
            imgUrl: imgFile,
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

        try {
            const savedPost = await postService.save(newPost)
            if (onPostCreated) onPostCreated(savedPost)

            setImgFile(null);
            setCaption('');
        } catch (err) {
            console.error("Failed to save post:", err)
            setIsPosting(false)
        }
    }

    return (
        <form className="create-post-form" onSubmit={handleAddPost}>
            <input type="file" accept="image/*" onChange={handleImgChange} />
            {imgFile && <img src={imgFile} className="preview-img" alt="Preview" />}

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