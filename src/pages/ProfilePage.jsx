import { Profile } from "../cmps/Profile"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

export function ProfilePage() {
    const { profile_id } = useParams()
    const { user, suggestedUsers = [], isLoading } = useSelector(state => state.userModule)

    if (isLoading) return (
        <section>
            <h1>Loading profile...</h1>
        </section>
    )

    // If a profile id is present in the URL, try to resolve that user from suggestedUsers
    // otherwise, fall back to the logged-in user
    let profileUser = null
    if (profile_id) {
        if (user && user._id === profile_id) profileUser = user
        else profileUser = suggestedUsers.find(su => su._id === profile_id)
    } else {
        profileUser = user
    }

    if (!profileUser) {
        return (
            <section>
                <h1>User not found</h1>
            </section>
        )
    }

    return (
        <Profile user={profileUser} />
    )
}
