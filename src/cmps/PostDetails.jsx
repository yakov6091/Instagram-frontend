import { useState, useEffect } from "react"
import { Svgs } from "./Svg"
import { user } from '../../data/post'
import { useParams } from 'react-router-dom'
export function PostDetails({ posts, onClose }) {
    console.log('post:', posts)
    const { postId } = useParams();

    const [post, setPost] = useState(null)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState([])
    const [commentTxt, setCommentTxt] = useState('')

    useEffect(() => {
        if (posts && posts.length > 0 && postId) {
            const foundPost = posts.find(post => post._id === postId);

            if (foundPost) {
                setPost(foundPost);
                setLikes(foundPost.likedBy.length);
                setComments(foundPost.comments || []);

            }
        }
    }, [posts, postId]);

    if (!post) {
        return <h1>Loading post...</h1>
    }

    const { imgUrl: imageUrl, by, txt: caption } = post

    function handleLike() {
        if (liked) {
            setLiked(false);
            setLikes(likes - 1);
        } else {
            setLiked(true);
            setLikes(likes + 1);
        }
    }

    function handleCommentChange(ev) {
        setCommentTxt(ev.target.value);
    }

    function handleAddComment(ev) {
        ev.preventDefault();
        if (!commentTxt.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            by: { fullname: 'You' },
            txt: commentTxt
        };
        setComments([...comments, newComment]);
        setCommentTxt('');
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

                    {comments?.map((comment, idx) => (
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
                            className={liked ? "liked" : ""}
                            onClick={handleLike}>
                            {liked ? Svgs.likeFilled : Svgs.likeOutLine}
                        </button>
                        <button onClick={onClose}>{Svgs.comment}</button>
                        <button>{Svgs.save}</button>
                    </div>

                    <p className="likes">{likes} likes</p>
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