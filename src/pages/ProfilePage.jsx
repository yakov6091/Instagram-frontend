// Example: src/pages/UserProfilePage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service'; // Assuming your service is exported
import { Profile } from '../cmps/Profile';
import { DEMO_USER_DATA } from '../store/actions/user.actions'

export function ProfilePage() {
    const { profileId } = useParams(); // 'profileId' must match the route path parameter
    const [viewedUser, setViewedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)

        let user = null
        if (profileId === DEMO_USER_DATA._id || profileId === DEMO_USER_DATA.username) {
            user = DEMO_USER_DATA
        } else {
            const users = userService.generateMockUsers(10)
            user = users.find(u => u._id === profileId || u.username === profileId)
        }

        setViewedUser(user)
        setIsLoading(false)
    }, [profileId])


    if (isLoading) return <div className="loading-profile">Loading profile...</div>;
    if (!viewedUser) return <div className="error-profile">User Not Found!</div>;

    return (
        <section className="user-profile-page">
            <Profile user={viewedUser} />
        </section>
    );
}