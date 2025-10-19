import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { user } from '../../data/post'
import { useParams } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { togglePostLike, addPostComment } from "../store/actions/post.actions"

export function PostDetails({ posts, onClose }) {
    const { postId } = useParams();
    const dispatch = useDispatch()

    const [post, setPost] = useState(null)
    const [commentTxt, setCommentTxt] = useState('')

    useEffect(() => {
        // The post is found in the *global* Redux state passed as a prop (`posts`)
        if (posts && posts.length > 0 && postId) {
            const foundPost = posts.find(post => post._id === postId)

            if (foundPost) {
                setPost(foundPost);
            }
        }
        // Dependency array ensures this runs when the post list or the postId changes
    }, [posts, postId]);

    if (!post) {
        return <h1>Loading post...</h1>
    }

    const { imgUrl: imageUrl, by, txt: caption } = post

    const isLiked = post.likedBy.some(like => like._id === user._id);
    const likeCount = post.likedBy.length;
    const postComments = post.comments || [];

    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value);
    }

    async function handleLike() {
        // 1. Optimistic UI update is usually handled inside the action/reducer
        // 2. Dispatch the action to update the backend and Redux store
        try {
            dispatch(togglePostLike(post._id));
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    }

    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value);
    }

    async function handleAddComment(ev) {
        ev.preventDefault();
        if (!commentTxt.trim()) return;

        // 1. Prepare data for the action
        const newCommentTxt = commentTxt.trim()

        try {
            // 2. Dispatch the action to save the comment
            dispatch(addPostComment(post._id, newCommentTxt));

            // 3. Clear local input state after successful dispatch
            setCommentTxt('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="post-details-modal" onClick={ev => ev.stopPropagation()}>
                {/* Left side: image*/}
                <div className="post-details-image">
                    <img src={imageUrl} />
                </div>

                {/* Right side: info*/}
                <div className="post-details-info">
                    <div className="post-details-header">
                        <div className="user-info">
                            <img src={user.imgUrl} />
                            <span className="username">{user.username}</span>
                        </div>

                    </div>
                </div>

                {/* Comments */}
                <div className="post-details-comments">
                    <div className="post-caption-owner-details comment">
                        <img className="profile-thumb" src={by.imgUrl} />
                        <div className="caption-text-content">
                            <span className="username">{by.fullname}</span>
                            {caption}
                        </div>
                    </div>

                    {postComments?.map((comment, idx) => (
                        <div className="comment" key={idx}>
                            <span className="username">{comment.by.fullname}</span>
                            {comment.txt}
                        </div>
                    ))}
                </div>

                {/* Likes + add comment */}
                <div className="post-details-footer">
                    <div className="button-container">
                        <button
                            className={isLiked ? "liked" : ""}
                            onClick={handleLike}>
                            {isLiked ? Svgs.likeFilled : Svgs.likeOutLine}
                        </button>
                        <button onClick={onClose}>{Svgs.comment}</button>
                        <button>{Svgs.save}</button>
                    </div>

                    <p className="likes">{likeCount} likes</p>
                    <form className="add-comment" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentTxt}
                            onChange={handleCommentChange} />
                    </form>
                </div>
            </div>
        </div>

    )
}