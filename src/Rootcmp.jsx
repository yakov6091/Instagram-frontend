import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage" // Assuming this is where you handle the user fetch
import { NavBar } from "./cmps/NavBar"
import { PostDetails } from "./cmps/PostDetails"
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { login, loadSuggestedUsers } from "./store/actions/user.actions"
import { loadPosts } from "./store/actions/post.actions"
import './assets/main.css'


export function App() { // Renamed from RootCmp if your file is named App.jsx

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        // Initial data loading for the app
        login()
        loadPosts()
        loadSuggestedUsers()
    }, [])

    // Handler to close the modal and return to the previous page, or home
    const onClose = () => {
        if (location.state?.background) navigate(-1) // Go back one page
        else navigate('/') // Go to the homepage
    }

    // Determine if we should render the modal (i.e., if there's a background route set)
    const background = location.state && location.state.background

    return (
        <section className="main-layout">
            <NavBar />

            <main className="feed-section">

                {/* Primary Routes: Renders the underlying page content. 
                If a modal is open (background is true), this block uses the background path 
                so the main content doesn't change when the modal URL loads.
                */}
                <Routes location={background || location}>

                    {/* Home Route */}
                    <Route path="/" element={
                        <div className="feed-content-wrapper">
                            <HomePage />
                        </div>
                    } />

                    {/*
                    This route now uses the /user/ prefix and reads the :profileId parameter.
                    The ProfilePage component must use useParams() to read this ID.
                    */}
                    <Route path="/:profileId" element={
                        <div className="profile-layout">
                            <ProfilePage />
                        </div>
                    } />

                    {/* The /post/:postId route is needed here so that if the user loads the post URL 
                    directly, it loads the HomePage content underneath.
                    */}
                    <Route path="/post/:postId" element={<HomePage />} />
                </Routes>

                {/* Modal Route: Renders the modal component ONLY if 'background' state is set. 
                It listens specifically for the post URL path.
                */}
                {background && (
                    <Routes>
                        <Route path="/post/:postId" element={<PostDetails onClose={onClose} />} />
                    </Routes>
                )}
            </main>


        </section>
    )
}