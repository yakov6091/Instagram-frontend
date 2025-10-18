import { PostCard } from "./PostCard"

export function PostList({ stories }) {
    // console.log(stories)
    return (
        <section className="post-list">
            {stories.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </section>
    )
}