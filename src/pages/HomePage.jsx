import { StoryList } from "../cmps/StoryList"
import { postService } from "../../services/postService"
import { useState, useEffect } from "react"
import { CreatePost } from "../cmps/CreatePost"
import { Modal } from "../cmps/Modal"

export function HomePage() {
    const [stories, setStories] = useState([])
    const [error, setError] = useState(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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

    function handlePostCreationSuccess(newPost) {
        setIsCreateModalOpen(false)

        //To show the new post without a full page refresh
        setStories(prevStories => [newPost, ...prevStories])

    }

    return (
        <section className="story-container">
            {error && <p>{error}</p>}
            <StoryList stories={stories} />
        </section>
    )
}
