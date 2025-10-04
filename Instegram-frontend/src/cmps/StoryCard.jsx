import { useState } from "react"
import { Svgs } from "./Svg"
export function StoryCard({ story }) {
    const {
        txt,
        imgUrl,
        by,
        comments = [],
        likedBy = [],
    } = story;

    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(likedBy.length)

    function handleLike() {
        if (liked) {
            setLiked(false)
            setLikes(likes - 1)
        } else {
            setLiked(true)
            setLikes(likes + 1)
        }
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
                    onClick={handleLike}
                    style={{ color: liked ? "red" : "inherit" }}>
                    {Svgs.like}</button>

                <button>{Svgs.comment}</button>
                <button>{Svgs.save}</button>
            </div>

            <div className="like-span">
                <span className="likes-count">{likes} </span>Likes
            </div>

            <div>
                <div className="comments-container">
                    {comments && comments.map(comment => (
                        <div key={comment.id}>
                            <b>{comment.by.fullname}:</b> {comment.txt}
                        </div>
                    ))}
                </div>
                <input type="text" placeholder="Add a comment" className="comment" />
            </div>

        </section >
    )

}