// --- MOCK DATA GENERATION HELPERS (Now properly defined) ---
const names = ['Kai', 'Sasha', 'Leo', 'Mia', 'Jax', 'Zoe', 'Finn', 'Nala', 'Ryu', 'Skye'];
const commentTexts = ['Wow!', 'Great shot!', 'Love this!', 'Amazing', 'So cool.', 'Where is this?', 'Nice!', 'Awesome view'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomId = () => Math.random().toString(36).substring(2, 9);
const getRandomName = (arr) => arr[getRandomInt(0, arr.length - 1)]; // The missing function!

// Hardcoded ID for the logged-in user (for exclusion)
const CURRENT_USER_ID = 'u101';

// Helper to create a user mini-profile for 'following'/'followers' arrays
const createMiniProfile = (idPrefix, userIdx, index) => {
    const randomName = getRandomName(names);
    // Make the id deterministic and include userIdx to avoid collisions across multiple users
    const id = `${idPrefix}-${userIdx}-${index}-${getRandomId()}`;
    const gender = index % 2 === 0 ? 'men' : 'women'
    const avatarId = getRandomInt(1, 99)
    return {
        _id: id,
        fullname: `${randomName}`,
        username: `${randomName.toLowerCase()}${getRandomInt(1, 99)}`,
        imgUrl: `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`,
    };
}

const createMockComment = (postId, cIndex) => {
    // 0 to 3 likes per comment
    const likeCount = getRandomInt(0, 3);
    return {
        _id: `c-${postId}-${cIndex}-${getRandomId()}`,
        txt: getRandomName(commentTexts),
        by: createMiniProfile('cBy', cIndex, postId),
        likedBy: Array.from({ length: likeCount }, (_, lIndex) =>
            createMiniProfile('cLk', cIndex, lIndex)
        )
    };
};

/**
 * Generates 10 detailed mock users for suggestion, adhering to the required format.
 */
function generateMockUsers(count = 10) {
    const detailedUsers = [];
    const usedUsernames = new Set();
    const usedUserIds = new Set();

    for (let i = 0; i < count; i++) {
        const randomName = getRandomName(names);
        let username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        while (usedUsernames.has(username)) {
            username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        }
        usedUsernames.add(username);

        // Ensure unique userId
        let userId = `r${getRandomId()}`;
        while (usedUserIds.has(userId)) userId = `r${getRandomId()}`;
        usedUserIds.add(userId);

        const userFullname = `${randomName} ${getRandomName(['Rider', 'Hiker', 'Chef', 'Dev'])}`;
        const userImgUrl = `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${getRandomInt(1, 99)}.jpg`;

        // --- FIX ADDED HERE ---
        const followerCount = getRandomInt(5, 10); // DEFINED BEFORE USE
        const followingCount = getRandomInt(2, 5); // DEFINED BEFORE USE
        // ---

        const postCount = getRandomInt(3, 5);

        const user = {
            _id: userId,
            username: username,
            fullname: userFullname,
            imgUrl: userImgUrl,

            posts: Array.from({ length: postCount }, (_, pIndex) => {
                const postId = `${userId}-p${pIndex}`;
                const commentCount = getRandomInt(1, 5);

                const comments = Array.from({ length: commentCount }, (_, cIndex) =>
                    createMockComment(postId, cIndex)
                );

                return {
                    _id: postId,
                    thumbnailUrl: `https://picsum.photos/seed/${i * 10 + pIndex}/300/300`,
                    imgUrl: `https://picsum.photos/seed/${i * 10 + pIndex}/800/800`,
                    isVideo: Math.random() < 0.2,
                    createdAt: Date.now() - (pIndex * 1000 * 60 * 60),

                    txt: getRandomName(commentTexts),

                    by: {
                        _id: userId,
                        username: username,
                        fullname: userFullname,
                        imgUrl: userImgUrl
                    },

                    likedBy: Array.from({ length: getRandomInt(2, 10) }, (_, lIndex) =>
                        createMiniProfile('pLike', userId, lIndex)
                    ),

                    comments: comments
                };
            }),

            // --- VARIABLES ARE NOW DEFINED AND CAN BE USED HERE ---
            following: Array.from({ length: followingCount }, (_, fIndex) => createMiniProfile('uF', i, fIndex)),
            followers: Array.from({ length: followerCount }, (_, fIndex) => createMiniProfile('uR', i, fIndex)),

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
