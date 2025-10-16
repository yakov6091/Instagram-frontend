import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { user } from '../../data/story'
export function PostDetails({ post, onClose, isLiked, onLikeToggle, onAddComment, commentTxt, onCommentChange }) {
    console.log('Post:', post)

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="post-details-modal" onClick={ev => ev.stopPropagation()}>
                {/* Left side: image*/}
                <div className="post-details-image">
                    <img src={post.imageUrl} />
                </div>

                {/* Right side: info*/}
                <div className="post-details-info">
                    <div className="post-details-header">

                        <div className="user-info">
                            <img src={user.imgUrl} />
                            <span className="username">{user.username}</span>
                        </div>

                        {/* <button className="close-btn" onClick={onClose}>
                            ✖
                        </button> */}
                    </div>
                </div>

                {/* Comments */}
                <div className="post-details-comments">
                    <div className="post-caption-owner-details comment">
                        <img className="profile-thumb" src={post.userImg} />
                        <div className="caption-text-content">
                            <span className="username">{post.username}</span>
                            {post.caption}
                        </div>
                    </div>

                    {post.comments?.map((comment, idx) => (
                        <div className="comment" key={idx}>
                            <span className="username">{comment.user}</span>
                            {comment.text}
                        </div>
                    ))}
                </div>

                {/* Likes + add comment */}
                <div className="post-details-footer">
                    <div className="button-container">
                        <button
                            className={isLiked ? "liked" : ""}
                            onClick={onLikeToggle}>
                            {isLiked ? Svgs.likeFilled : Svgs.likeOutLine}
                        </button>
                        <button onClick={onClose}>{Svgs.comment}</button>
                        <button>{Svgs.save}</button>
                    </div>

                    <p>{post.likes} likes</p>
                    <form className="add-comment" onSubmit={onAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentTxt}
                            onChange={onCommentChange} />
                    </form>
                </div>
            </div>
        </div>

    )
}