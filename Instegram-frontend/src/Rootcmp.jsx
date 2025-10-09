import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './assets/main.css'
import { useState } from "react"

export function App() {
    const [posts, setPosts] = useState([])

    return (
        <section className="main-layout">
            <Router>
                <NavBar onNewPost={(post) => setPosts([post, ...posts])} />

                <main>
                    <Routes>
                        <Route element={<HomePage osts={posts} setPosts={setPosts} />}
                            path="/">
                        </Route>

                        <Route element={<ProfilePage posts={posts} setPosts={setPosts} />}
                            path="/:profile_id">
                        </Route>
                    </Routes>
                </main>

                <footer>

                </footer>
            </Router>
        </section>
    )


}