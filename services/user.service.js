// --- MOCK DATA GENERATION HELPERS (Now properly defined) ---
const names = ['Kai', 'Sasha', 'Leo', 'Mia', 'Jax', 'Zoe', 'Finn', 'Nala', 'Ryu', 'Skye'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomId = () => Math.random().toString(36).substring(2, 9);
const getRandomName = (arr) => arr[getRandomInt(0, arr.length - 1)]; // The missing function!

// Hardcoded ID for the logged-in user (for exclusion)
const CURRENT_USER_ID = 'u101';

// Helper to create a user mini-profile for 'following'/'followers' arrays
const createMiniProfile = (idPrefix, index) => {
    const randomName = getRandomName(names);
    const id = `${idPrefix}${index}${getRandomId()}`;
    return {
        _id: id,
        fullname: `${randomName} User ${index}`,
        // Generate a random color placeholder image
        imgUrl: `https://placehold.co/40x40/${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}/FFFFFF?text=${randomName[0]}`,
    };
};

/**
 * Generates 10 detailed mock users for suggestion, adhering to the required format.
 * @param {number} count - The number of users to generate.
 * @returns {Array<Object>} The list of mock user profiles.
 */
function generateMockUsers(count = 10) {
    const detailedUsers = [];
    const usedUsernames = new Set();

    for (let i = 0; i < count; i++) {
        const randomName = getRandomName(names);
        let username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        while (usedUsernames.has(username)) {
            username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        }
        usedUsernames.add(username);

        const userId = `r${getRandomId()}`;
        const followerCount = getRandomInt(5, 10);
        const followingCount = getRandomInt(2, 5);
        const postCount = getRandomInt(3, 5);

        const user = {
            _id: userId,
            username: username,
            fullname: `${randomName} ${getRandomName(['Rider', 'Hiker', 'Chef', 'Dev'])}`,
            // Generate a random color placeholder image
            imgUrl: `https://placehold.co/60x60/${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}/FFFFFF?text=${randomName[0]}`,

            posts: Array.from({ length: postCount }, (_, pIndex) => ({
                _id: `p${getRandomId()}${pIndex}`,
                thumbnailUrl: `https://placehold.co/300x300/FCA5A5/FFFFFF?text=Post${pIndex + 1}`,
                isVideo: Math.random() < 0.2,
            })),

            following: Array.from({ length: followingCount }, (_, fIndex) => createMiniProfile('uF', fIndex)),

            // Generate followers
            followers: Array.from({ length: followerCount }, (_, fIndex) => createMiniProfile('uR', fIndex)),

            likedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
            savedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
        };

        detailedUsers.push(user);
    }
    return detailedUsers;
}


export const userService = {
    generateMockUsers,
    // Add real API calls here later (e.g., login, updateFollowStatus)
};
