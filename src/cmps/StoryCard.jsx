import { useState } from "react"
import { Svgs } from "./Svg"
import { Link } from "react-router-dom";

export function StoryCard({ story }) {
    const {
        txt,
        imgUrl,
        by,
        comments: initialComments = [], // Use story.comments if they exist, otherwise start with an empty []
        likedBy = [],
    } = story;

    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(likedBy.length)
    const [comments, setComments] = useState(initialComments)
    const [commentTxt, setCommentTxt] = useState('')

    function handleLike() {
        if (liked) {
            setLiked(false)
            setLikes(likes - 1)
        } else {
            setLiked(true)
            setLikes(likes + 1)
        }
    }

    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value)
    }

    function handleAddComment(ev) {
        ev.preventDefault()
        if (!commentTxt.trim()) return
        const newComment = {
            id: Date.now().toString(),
            by: { fullname: 'You' },
            txt: commentTxt
        }
        setComments([...comments, newComment])
        setCommentTxt('')

    }


    return (
        <section className="story-card-container">

            <header className="header-container">
                <img className="profile-thumb" src={by.imgUrl} />
                <span className="name">{by.fullname} </span>
                <span className="time"><span>•</span>  Now</span>
                <span className="dots">{Svgs.dots}</span>
            </header>

            <div className="img-container">
                <img src={imgUrl} />
            </div>

            <div className="button-container">
                <button
                    className={liked ? "liked" : ""}
                    onClick={handleLike}>
                    {liked ? Svgs.likeFilled : Svgs.likeOutLine}</button>

                <button>{Svgs.comment}</button>
                <button>{Svgs.save}</button>
            </div>

            <div className="like-span">
                <span className="likes-count">{likes} Likes</span>
            </div>

            <div className="story-txt">
                <span><b>{by.fullname}</b> {txt}</span>
            </div>

            <div>
                {comments.length > 0 && (
                    <div
                        className="view-all-comments"
                        // For now, you can leave onClick empty or later open a modal
                        onClick={() => { }}
                    >
                        <Link to="#">View all {comments.length} comments</Link>
                    </div>
                )}
            </div>

            <form onSubmit={handleAddComment}>
                <input
                    type="text"
                    placeholder="Add a comment"
                    className="comment"
                    value={commentTxt}
                    onChange={handleCommentChange} />
            </form>

            <hr className="comment-separator" />
        </section >
    )

}