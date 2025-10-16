// App.jsx

import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { StoryDetails } from "./cmps/StoryDetails"
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { postService } from "../services/postService"

import './assets/main.css'

export function App() {
    const [posts, setPosts] = useState([])
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        // You would typically call your service to get the list of stories
        postService.query()
            .then(loadedPosts => {
                console.log('Stories loaded successfully:', loadedPosts)
                setPosts(loadedPosts) // This updates the state
            })
            .catch(err => {
                console.error('Error loading stories:', err)
                // Handle error (e.g., show error message)
            })
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

                {/* 2. MODAL OVERLAY: Render the StoryDetails component if the 'background' state is set */}
                {/* This conditional block renders the modal *over* the background route */}
                {background && (
                    <Routes>
                        <Route path="/post/:postId" element={<StoryDetails posts={posts} onClose={onClose} />} />
                    </Routes>
                )}
            </main>

            <footer></footer>
        </section>
    )
}