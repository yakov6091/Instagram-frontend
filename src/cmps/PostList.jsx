import { PostCard } from "./PostCard"
import { useSelector } from 'react-redux'

export function PostList({ stories = [] }) {
    // Pull suggested users from the store and convert their latest post to a PostCard-ready shape
    const suggestedUsers = useSelector(state => state.userModule.suggestedUsers || [])

    const suggestedUsersPosts = suggestedUsers
        .map(su => {
            const latest = (su.posts || [])[0]
            if (!latest) return null
            // Transform the mini-post into the shape PostCard expects
            return {
                // Ensure this generated id cannot collide with real post ids by adding a prefix
                _id: `suggested-${su._id}-${latest._id}`,
                imgUrl: latest.thumbnailUrl || latest.imgUrl,
                txt: '',
                by: {
                    _id: su._id,
                    username: su.username,
                    imgUrl: su.imgUrl,
                },
                comments: [],
                likedBy: [],
                createdAt: latest.createdAt || Date.now(),
            }
        })
        .filter(Boolean)

    // Combine the given stories with suggested users' latest posts
    const combined = [...stories, ...suggestedUsersPosts]

    // Filter out posts we don't want to render (e.g., missing image or specific IDs like 'post1')
    const visible = combined.filter(p => p && p._id !== 'post1' && (p.imgUrl || p.thumbnailUrl))

    return (
        <section className="post-list">
            {visible.map((post, idx) => (
                // Use a composite key (id + index) to guarantee uniqueness
                <PostCard key={`${post._id}-${idx}`} post={post} />
            ))}
        </section>
    )
}