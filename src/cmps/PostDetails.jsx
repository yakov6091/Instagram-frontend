import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import { togglePostLike, addPostComment, toggleCommentLike } from "../store/actions/post.actions"

export function PostDetails({ onClose }) {
    const { postId } = useParams()
    const { user } = useSelector(state => state.userModule)
    const { posts } = useSelector(state => state.postModule)

    const location = useLocation()
    const [post, setPost] = useState(null)
    const [commentTxt, setCommentTxt] = useState('')

    useEffect(() => {
        // 1. If the Link included the post in location.state, use it (works for suggested users' posts)
        if (location.state && location.state.post) {
            setPost(location.state.post)
            return
        }

        // 2. Otherwise, try to find the post in the posts array from the store
        if (posts && postId) {
            const foundPost = posts.find(post => post._id === postId)
            if (foundPost) setPost(foundPost)
        }
    }, [posts, postId, location.state])

    if (!post) {
        return <div className="loading-post-details"><h1>Loading post...</h1></div>
    }

    // This line is now safe because we checked that 'post' is not null
    const { imgUrl, by, txt: caption, likedBy = [], comments = [] } = post

    const isLiked = user ? likedBy.some(like => like._id === user._id) : false
    const likeCount = likedBy.length

    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value)
    }

    // Directly call the async action function
    async function handleLike() {
        if (!user) return

        const userMiniProfile = {
            _id: user._id,
            username: user.username,
            imgUrl: user.imgUrl
        }
        // Call the async function directly
        await togglePostLike(post._id, user._id, userMiniProfile, post)
    }

    //  Directly call the async action function
    async function handleAddComment(ev) {
        ev.preventDefault()
        if (!commentTxt.trim() || !user) return

        // This is a minimal ID generator
        const tempId = 'c' + Date.now() + Math.random().toString(36).substring(2, 5)

        const newComment = {
            _id: tempId,
            txt: commentTxt.trim(),
            likedBy: [],
            by: {
                _id: user._id,
                fullname: user.fullname || user.username,
                username: user.username,
                imgUrl: user.imgUrl
            }
        }
        // Call the async function directly; pass post so action can persist if needed
        await addPostComment(post._id, newComment, post)
        setCommentTxt('')
    }

    // Function to render an individual comment
    const renderComment = (comment, idx) => {
        const isCurrentUserComment = user && comment.by._id === user._id
        // MODIFIED: Prioritize username, just like you do for the post caption
        const displayName = (comment.by.username || comment.by.fullname);

        const commentLikedBy = comment.likedBy || []
        const isCommentLiked = user ? commentLikedBy.some(like => like._id === user._id) : false
        const commentLikeCount = commentLikedBy.length

        const likeCountText =
            commentLikeCount > 0
                ? `${commentLikeCount} ${commentLikeCount === 1 ? 'like' : 'likes'}`
                : '';

        return (
            // Using comment._id is best, falling back to comment.id or a composite id if not available
            <div className="comment" key={comment._id || comment.id || `${post._id}-c-${idx}`}>

                {/* ADDED: This is the profile picture for the commenter */}
                <img
                    className="profile-thumb"
                    src={comment.by.imgUrl}
                />

                {/* Main comment content wrapper */}
                <div className="comment-main-content">
                    <div> {/* This inner div helps group the text */}
                        <span className="username">{displayName}</span>
                        {comment.txt}
                    </div>

                    {/* Like Count */}
                    {likeCountText && <p className="comment-likes-count-text">{likeCountText}</p>}
                </div>

                {/* Comment interaction area (Like button and count) */}
                <div className="comment-interaction">
                    {/* Like Button */}
                    <button
                        className={`comment-like-btn ${isCommentLiked ? "liked" : ""}`}
                        // Use a smaller icon for the comment like button
                        onClick={() => handleCommentLike(comment._id)}>
                        {isCommentLiked ? Svgs.likeFilledSmall : Svgs.likeOutLineSmall}
                    </button>
                </div>
            </div>
        )
    }

    const handleCommentLike = async (commentId) => {
        if (!user) return

        const userMiniProfile = {
            _id: user._id,
            username: user.username,
            imgUrl: user.imgUrl
        }

        // Call the new action function
        await toggleCommentLike(post._id, commentId, user._id, userMiniProfile)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="post-details-modal" onClick={ev => ev.stopPropagation()}>
                {/* Left side: image*/}
                <div className="post-details-image">
                    <img src={imgUrl} />
                </div>

                {/* Right side: info*/}
                <div className="post-details-info">
                    <div className="post-details-header">
                        <div className="user-info">
                            <img src={by.imgUrl} />
                            <span className="username">{by.username || by.fullname}</span>
                        </div>

                    </div>
                </div>

                {/* Comments */}
                <div className="post-details-comments">
                    <div className="post-caption-owner-details comment">
                        <img className="profile-thumb" src={by.imgUrl} />
                        <div className="caption-text-content">
                            <span className="username">{by.username || by.fullname}</span>
                            {caption}
                        </div>
                    </div>

                    {comments?.map((c, idx) => renderComment(c, idx))}
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
