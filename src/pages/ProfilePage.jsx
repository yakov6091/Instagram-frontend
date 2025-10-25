import { Profile } from "../cmps/Profile"
import { useSelector } from "react-redux"

export function ProfilePage() {
    const { user, isLoading } = useSelector(state => state.userModule)

    if (isLoading) {
        return (
            <section>
                <h1>Loading profile...</h1>
            </section>
        )
    }

    if (!user) {
        return (
            <section>
                <h1>No user found. Please log in.</h1>
            </section>
        )
    }

    return (
        <Profile user={user} />
    )
}
