import { PostList } from "../cmps/PostList"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadPosts } from "../store/actions/post.actions"
import { UsersPreview } from "../cmps/UsersPreview"

export function HomePage() {
    // Read posts from Redux store
    const posts = useSelector(state => state.postModule.posts || [])
    const isLoading = useSelector(state => state.postModule.flag.isLoading)

    useEffect(() => {
        loadPosts()
    }, [])

    if (isLoading) return <div>Loading posts...</div>

    return (
        <>
            <section className="post-container">
                <PostList stories={posts} />
            </section>

            <aside className="users-sections">
                <UsersPreview />
            </aside>
        </>
    )
}
