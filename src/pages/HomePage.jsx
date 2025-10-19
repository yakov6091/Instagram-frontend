import { PostList } from "../cmps/PostList"
import { postService } from "../../services/postService"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loadPosts } from "../store/actions/post.actions"

export function HomePage() {
    const dispatch = useDispatch()

    // Read the posts array from the Redux store
    const posts = useSelector(state => state.postModule.posts || [])

    useEffect(() => {
        loadPosts()

    }, [])

    return (
        <section className="post-container">
            <PostList stories={posts} />
        </section>
    )
}
