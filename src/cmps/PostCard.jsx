import { useState } from "react"
import { Svgs } from "./Svg"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { togglePostLike, addPostComment } from "../store/actions/post.actions"
import { togglePostSave } from "../store/actions/user.actions"
import { timeAgo } from "../../services/util"
import EmojiPicker from "emoji-picker-react"

export function PostCard({ post }) {
    const { user } = useSelector(state => state.userModule)

    const {
        _id,
        txt,
        imgUrl,
        by,
        comments = [],
        likedBy = [],
        createdAt
    } = post

    const location = useLocation()
    const postUrl = `/post/${_id}`

    // Determine if the current user has liked the post
    const isLiked = user ? likedBy.some(like => like._id === user._id) : false
    const likesCount = likedBy.length

    // Determine if the current post is in the user's saved list
    const isSaved = user && user.savedPostIds ? user.savedPostIds.includes(_id) : false

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [commentTxt, setCommentTxt] = useState('')

    // Format timestamp
    const formattedTime = createdAt ? timeAgo(createdAt) : ''

    // Handle emoji
    function handleEmojiClick(emojiData) {
        setCommentTxt(prev => prev + emojiData.emoji)
        setShowEmojiPicker(false) // Close picker after selecting
    }

    function toggleEmojiPicker(ev) {
        ev.preventDefault()
        setShowEmojiPicker(prev => !prev)
    }

    // Toggle like action
    async function handleLike() { // FIX: Made function async
        if (!user) {
            console.log("User must be logged in to like a post.")
            return
        }

        const userMiniProfile = {
            _id: user._id,
            username: user.username,
            imgUrl: user.imgUrl
        }

        // Call the async action function directly
        await togglePostLike(_id, user._id, userMiniProfile)
    }

    async function handleSave() {
        if (!user) {
            console.log("User must be logged in to save a post.")
            return
        }

        // This action should update the user's 'savedPostIds' array in the Redux store
        // and update the backend to save/unsave the post.
        await togglePostSave(_id, user._id, isSaved)
    }

    // Update comment input
    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value)
    }

    // Add comment action
    async function handleAddComment(ev) {
        ev.preventDefault()
        const comment = commentTxt.trim()
        if (!comment || !user) return

        // Generate a temporary ID for optimistic update/rollback (crucial)
        const tempId = 'c' + Date.now() + Math.random().toString(36).substring(2, 5)

        const newComment = {
            _id: tempId,
            txt: comment,
            by: {
                _id: user._id,
                username: user.username,
                imgUrl: user.imgUrl
            }
        }

        // Call the async action function directly
        await addPostComment(_id, newComment)

        setCommentTxt('')
    }

    return (
        <section className="post-card-container">

            <header className="header-container">
                <img
                    className="profile-thumb"
                    src={by.imgUrl}
                />
                <span className="name">{by.username || by.fullname}</span>
                <span className="time">{formattedTime}</span>
                <span className="dots">{Svgs.dots}</span>
            </header>

            <div className="img-container">
                <img src={imgUrl} />
            </div>

            <div className="button-container">
                <button
                    className={isLiked ? "liked" : ""}
                    onClick={handleLike}
                >
                    {isLiked ? Svgs.likeFilled : Svgs.likeOutLine}
                </button>

                <Link to={postUrl} state={{ background: location }}>
                    <button>{Svgs.comment}</button>
                </Link>

                <button
                    onClick={handleSave}
                    className={isSaved ? "saved" : ""}
                >
                    {isSaved ? Svgs.saved : Svgs.save}
                </button>
            </div>

            <div className="like-span">
                <span className="likes-count">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </div>

            <div className="post-txt">
                <span><b>{by.username || by.fullname}</b> {txt}</span>
            </div>

            {comments.length > 0 && (
                <div className="view-all-comments">
                    <Link to={postUrl} state={{ background: location }}>
                        View all {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </Link>
                </div>
            )}

            <form onSubmit={handleAddComment} className="add-comment-form">
                <input
                    type="text"
                    placeholder="Add a comment"
                    className="comment"
                    value={commentTxt}
                    onChange={handleCommentChange}
                    disabled={!user}
                />
                <button
                    type="button"
                    className="emoji-picker"
                    onClick={toggleEmojiPicker}
                >
                    {Svgs.emoji}
                </button>

                {showEmojiPicker && (
                    <div className="emoji-picker-container">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </form>

            <hr className="comment-separator" />
        </section>
    )
}
