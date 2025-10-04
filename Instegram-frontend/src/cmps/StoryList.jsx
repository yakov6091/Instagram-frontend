import { StoryCard } from "./StoryCard"

export function StoryList({ stories }) {
    console.log(stories)
    return (
        <section className="story-list">
            {stories.map(story => (
                <StoryCard key={story._id} story={story} />
            ))}
        </section>
    )
}