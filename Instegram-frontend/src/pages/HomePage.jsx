import { StoryList } from "../cmps/StoryList"
import { story } from '../../data/story'
import { useState } from "react"


export function HomePage() {
    const stories = [story]


    return (
        <section className="story-container">
            <StoryList stories={stories} />

        </section>
    )

}