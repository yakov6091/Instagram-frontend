import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { PostDetails } from "./cmps/PostDetails"
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { postService } from "../services/postService"

import './assets/main.css'

export function App() {
    const [posts, setPosts] = useState([])
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Await the service function call and store the result
                const loadedPosts = await postService.query()

                // Update the state with the result
                setPosts(loadedPosts);
            } catch (error) {
                // Catch and log any errors
                console.error('Error loading stories:', error)
            }
        }
        // Call the async function immediately
        loadPosts()
    }, [])


    const onClose = () => {
        navigate(-1);
    }

    // Save background location if modal is open (This logic is correct for modals)
    const background = location.state && location.state.background

    return (
        <section className="main-layout">
            <NavBar onNewPost={(post) => setPosts([post, ...posts])} />

            <main>
                {/* 1. PRIMARY ROUTES: Match the actual URL */}
                {/* We use 'background || location' to keep the background location for the modal overlay */}
                <Routes location={background || location}>
                    <Route path="/" element={<HomePage posts={posts} setPosts={setPosts} />} />
                    <Route path="/:profile_id" element={<ProfilePage posts={posts} setPosts={setPosts} />} />

                    {/* The router must know this path exists. It will load this component 
                       when you navigate, and it will be covered by the modal logic below. */}
                    <Route path="/post/:postId" element={<HomePage posts={posts} setPosts={setPosts} />} />
                </Routes>

                {/* 2. MODAL OVERLAY: Render the PostDetails component if the 'background' state is set */}
                {/* This conditional block renders the modal *over* the background route */}
                {background && (
                    <Routes>
                        <Route path="/post/:postId" element={<PostDetails posts={posts} onClose={onClose} />} />
                    </Routes>
                )}
            </main>

            <footer></footer>
        </section>
    )
}