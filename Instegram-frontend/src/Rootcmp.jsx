import { HomePage } from "./pages/HomePage"
import { ProfilePage } from "./pages/ProfilePage"
import { NavBar } from "./cmps/NavBar"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './assets/main.css'

export function App() {

    return (
        <section className="main-layout">
            <Router>
                <NavBar />

                <main>
                    <Routes>
                        <Route element={<HomePage />} path="/"></Route>
                        <Route element={<ProfilePage />} path="/:profile_id"></Route>
                    </Routes>
                </main>

                <footer>

                </footer>
            </Router>
        </section>
    )


}