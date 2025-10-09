import { StoryList } from "../cmps/StoryList"
import { postService } from "../../services/postService"
import { useState, useEffect } from "react"

export function HomePage() {
    const [stories, setStories] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadStories() {
            try {
                const posts = await postService.query()
                setStories(posts)
            } catch (err) {
                console.error("Failed to load posts:", err)
                setError("Could not load stories.")
            }
        }

        loadStories()
    }, [])

    return (
        <section className="story-container">
            {error && <p>{error}</p>}
            <StoryList stories={stories} />
        </section>
    )
}
