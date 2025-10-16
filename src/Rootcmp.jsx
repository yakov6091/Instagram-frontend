import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { PostDetails } from "./cmps/PostDetails"
import { Route, Routes, useLocation } from 'react-router-dom'
import { useState } from "react"

import './assets/main.css'

export function App() {
    const [posts, setPosts] = useState([])
    const location = useLocation()

    // Save background location if modal is open
    const state = location.state && location.state.background

    return (
        <section className="main-layout">
            <NavBar onNewPost={(post) => setPosts([post, ...posts])} />

            <main>
                <Routes location={state || location}>
                    <Route path="/" element={<HomePage posts={posts} setPosts={setPosts} />} />
                    <Route path="/:profile_id" element={<ProfilePage posts={posts} setPosts={setPosts} />} />
                </Routes>

                {state && (
                    <Routes>
                        <Route path="/post/:postId" element={<PostDetails posts={posts} />} />
                    </Routes>
                )}
            </main>

            <footer></footer>
        </section>
    )
}
