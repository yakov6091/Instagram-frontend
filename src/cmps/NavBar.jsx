import { Svgs } from './Svg'
import { Link, useLocation } from 'react-router-dom'
import { CreatePost } from '../cmps/CreatePost'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export function NavBar() {
    const { user } = useSelector(state => state.userModule)
    const [showCreatePost, setShowCreatePost] = useState(false)
    const location = useLocation()

    const profilePath = user ? `/${user._id}` : '/login'
    const isHome = location.pathname === '/'

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="logo-text">{Svgs.instagram}</Link>
                </div>

                <ul className="navbar-list">
                    <li>
                        <Link to="/">
                            {isHome ? Svgs.homeFilled : Svgs.home}
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
                        <Link to={profilePath}> {/* This now correctly points to /user/u101 */}
                            <img src={user.imgUrl} className='profile-icon' />
                            <span> Profile</span>
                        </Link>
                    </li>
                </ul>
            </nav>


            {showCreatePost && (
                <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <CreatePost
                            onPostCreated={() => setShowCreatePost(false)}
                        />
                    </div>
                </div>
            )}

        </>
    )
}
