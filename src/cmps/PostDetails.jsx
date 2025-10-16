import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { user } from '../../data/story'
export function PostDetails({
    story, // Now receiving the whole story object
    currentComments, // State version of comments
    currentLikes, // State version of likes
    onClose,
    isLiked,
    onLikeToggle,
    onAddComment,
    commentTxt,
    onCommentChange
}) {
    console.log('story:', story)

    //Access data directly from the story object
    const { imgUrl: imageUrl, by, txt: caption } = story

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

                    {currentComments?.map((comment, idx) => (
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
                            onClick={onLikeToggle}>
                            {isLiked ? Svgs.likeFilled : Svgs.likeOutLine}
                        </button>
                        <button onClick={onClose}>{Svgs.comment}</button>
                        <button>{Svgs.save}</button>
                    </div>

                    <p>{currentLikes} likes</p>
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