import { Svgs } from './Svg'
import { Link } from 'react-router-dom'
import { CreatePost } from '../cmps/CreatePost'
import { useState } from 'react'
import { user } from '../../data/story'


export function NavBar({ onNewPost }) {
    const [showCreatePost, setShowCreatePost] = useState(false)

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="logo-text">{Svgs.instagram}</Link>
                </div>

                <ul className="navbar-list">
                    <li>
                        <Link to="/">
                            {Svgs.home}
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="create-post-btn"
                            onClick={() => setShowCreatePost(!showCreatePost)}
                        >
                            {Svgs.add}
                            <span>New Post</span>
                        </Link>

                    </li>
                    <li>
                        <Link to="/profile">
                            <img src={user.imgUrl} className='profile-icon' />
                            <span> Profile</span>
                        </Link>

                    </li>
                </ul>
            </nav>
            {showCreatePost && (
                <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
                    <div
                        className="modal-content"
                        onClick={e => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        <CreatePost
                            onPostCreated={(post) => {
                                if (onNewPost) onNewPost(post)
                                setShowCreatePost(false) // close modal
                            }}
                        />
                    </div>
                </div>
            )}

        </>
    )
}
