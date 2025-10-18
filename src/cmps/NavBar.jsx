import { Svgs } from './Svg'
import { Link } from 'react-router-dom'
import { CreatePost } from '../cmps/CreatePost'
import { Modal } from './Modal'
import { useState } from 'react'
import { user } from '../../data/post'


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
                            <span>Create</span>
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
                        onClick={e => e.stopPropagation()}
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
