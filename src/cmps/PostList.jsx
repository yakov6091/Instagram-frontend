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
                // Provide a stable render id used for React keys so replacing the post won't remount
                _renderId: `suggested-${su._id}-${latest._id}`,
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

    // Remove duplicates (same image) that may come from stories and suggested users
    const seen = new Set()
    const deduped = combined.filter(p => {
        if (!p) return false
        const key = p.imgUrl || p.thumbnailUrl || p._id
        if (!key) return false
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })

    // Filter out posts we don't want to render (e.g., specific invalid IDs)
    const visible = deduped.filter(p => p._id !== 'post1')

    return (
        <section className="post-list">
            {visible.map((post, idx) => (
                // Use a stable render id when provided to avoid remounting when post._id changes
                <PostCard key={post._renderId || `${post._id}-${idx}`} post={post} />
            ))}
        </section>
    )
}