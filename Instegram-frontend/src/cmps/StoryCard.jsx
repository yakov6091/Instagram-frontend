
import { Svgs } from "./Svg"
export function StoryCard({ story }) {

    return (
        <section className="story-card-container">

            <header className="header-container">
                <span className="name">Name</span>
                <span className="time">Now</span>
                <button>Follow</button>
            </header>

            <div className="img-container">
                <img src="https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg" alt="image" />
            </div>

            <div className="button-container">
                <button>{Svgs.like}</button>
                <button>{Svgs.comment}</button>
                <button>{Svgs.save}</button>
            </div>

            <div className="like-span">
                <span className="likes-count">{1} </span>Likes
            </div>

            <div>
                <div className="comments-container"></div>
                <input type="text" placeholder="Add a comment" className="comment" />
            </div>

        </section >
    )

}