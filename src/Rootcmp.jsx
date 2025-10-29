import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { PostDetails } from "./cmps/PostDetails"
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { login, loadSuggestedUsers } from "./store/actions/user.actions"
import { loadPosts } from "./store/actions/post.actions"
import { UsersPreview } from "./cmps/UsersPreview"
import './assets/main.css'


export function App() {

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        login()
        loadPosts()
        // Ensure we have suggested users available so profile pages for other users can be resolved
        loadSuggestedUsers()
    }, [])

    const onClose = () => {
        if (location.state?.background) navigate(-1)
        else navigate('/')
    }

    // If there’s a background route, it means the modal should open
    const background = location.state && location.state.background

    return (
        <section className="main-layout">
            <NavBar />

            <main className="feed-section">
                {/* Primary Routes */}
                <Routes location={background || location}>
                    {/* Note: In your routing, the ProfilePage path should probably be /profile/:id */}
                    <Route path="/" element={<div className="feed-content-wrapper"><HomePage /></div>} />

                    <Route path="/:profile_id" element={
                        <div className="profile-layout">
                            <ProfilePage />
                            {/* <ProfilePage /> */}
                        </div>} />

                    {/* This route renders HomePage under /post/:postId, which is fine for modal setup */}
                    <Route path="/post/:postId" element={<HomePage />} />
                </Routes>

                {/* Modal Route */}
                {background && (
                    <Routes>
                        {/* The PostDetails component will need the posts data, which is usually passed via props or retrieved with useSelector inside the component */}
                        <Route path="/post/:postId" element={<PostDetails onClose={onClose} />} />
                    </Routes>
                )}
            </main>


        </section>
    )
}