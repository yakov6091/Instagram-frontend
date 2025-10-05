import { useState } from "react"
import { Svgs } from "./Svg"
export function StoryCard({ story }) {
    const {
        txt,
        imgUrl,
        by,
        comments: initialComments = [],
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
                <span className="name">{by.fullname}</span>
                <span className="time">Now</span>
                <button>Follow</button>
            </header>

            <div className="img-container">
                <img src={imgUrl} alt="image" />
            </div>

            <div className="button-container">
                <button
                    onClick={handleLike}>
                    {liked ? Svgs.likeFilled : Svgs.likeOutLine}</button>

                <button>{Svgs.comment}</button>
                <button>{Svgs.save}</button>
            </div>

            <div className="like-span">
                <span className="likes-count">{likes} </span>Likes
            </div>

            <div className="story-txt">
                <span><b>{by.fullname}</b>: {txt}</span>
            </div>

            <div>
                <div className="comments-container">
                    {comments && comments.map(comment => (
                        <div key={comment.id}>
                            <b>{comment.by.fullname}:</b> {comment.txt}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment}>
                    <input
                        type="text"
                        placeholder="Add a comment"
                        className="comment"
                        value={commentTxt}
                        onChange={handleCommentChange} />
                </form>

            </div>

        </section >
    )

}