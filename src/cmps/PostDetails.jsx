import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import { togglePostLike, addPostComment } from "../store/actions/post.actions"

export function PostDetails({ onClose }) {
    const { postId } = useParams()
    const { user } = useSelector(state => state.userModule)
    const { posts } = useSelector(state => state.postModule)

    const [post, setPost] = useState(null)
    const [commentTxt, setCommentTxt] = useState('')

    useEffect(() => {
        if (posts && postId) {
            const foundPost = posts.find(post => post._id === postId)
            if (foundPost) setPost(foundPost)
        }
    }, [posts, postId])

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
        await togglePostLike(post._id, user._id, userMiniProfile)
    }

    //  Directly call the async action function
    async function handleAddComment(ev) {
        ev.preventDefault()
        if (!commentTxt.trim() || !user) return

        // This is a minimal ID generator for temporary optimistic updates
        const tempId = 'c' + Date.now() + Math.random().toString(36).substring(2, 5)

        const newComment = {
            _id: tempId, // Add a temporary ID for the optimistic update/rollback logic
            txt: commentTxt.trim(),
            by: {
                _id: user._id,
                fullname: user.fullname || user.username,
                username: user.username,
                imgUrl: user.imgUrl
            }
        }
        // NEW: Call the async function directly
        await addPostComment(post._id, newComment)
        setCommentTxt('')
    }

    // Function to render an individual comment
    const renderComment = (comment) => {
        const isCurrentUserComment = user && comment.by._id === user._id
        const displayName = isCurrentUserComment ? 'You' : comment.by.fullname;

        return (
            // Using comment._id is best, falling back to Math.random() if not available
            <div className="comment" key={comment._id || Math.random()}>
                <span className="username">{displayName}</span>
                {comment.txt}
            </div>
        )
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

                    {comments?.map(renderComment)}
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
