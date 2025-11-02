import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { PostDetails } from "./cmps/PostDetails"
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from "react"
import { login, loadSuggestedUsers } from "./store/actions/user.actions"
import { loadPosts } from "./store/actions/post.actions"
import './assets/main.css'


// Wrapper Component to inject the key
function PostDetailsWrapper({ onClose }) {
    // Get the postId from the URL path, which is defined in the <Route>
    const { postId } = useParams();

    // The key ensures React completely remounts the component 
    // whenever the postId changes (e.g., from /post/1 to /post/2).
    return <PostDetails key={postId} onClose={onClose} />;
}


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
        // This logic is correct for navigating back
        if (location.state?.background) navigate(-1)
        else navigate('/')
    }

    // Determine if we should render the modal (i.e., if there's a background route set)
    const background = location.state && location.state.background

    return (
        <section className="main-layout">
            <NavBar />

            <main className="feed-section">

                {/* Primary Routes (Renders the background page) */}
                <Routes location={background || location}>

                    {/* Home Route */}
                    <Route path="/" element={
                        <div className="feed-content-wrapper">
                            <HomePage />
                        </div>
                    } />

                    {/* Profile Route */}
                    <Route path="/:profileId" element={
                        <div className="profile-layout">
                            <ProfilePage />
                        </div>
                    } />

                    {/* Post Route (Needed for direct link loads) */}
                    <Route path="/post/:postId" element={<HomePage />} />
                </Routes>

                {/* Modal Route: Renders the modal component ONLY if 'background' state is set. */}
                {background && (
                    <Routes>
                        <Route
                            path="/post/:postId"
                            //  Use the new wrapper component here!
                            element={<PostDetailsWrapper onClose={onClose} />}
                        />
                    </Routes>
                )}
            </main>
        </section>
    )
}