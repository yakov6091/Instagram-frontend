// --- MOCK DATA GENERATION HELPERS (As provided by you) ---
const names = ['Kai', 'Sasha', 'Leo', 'Mia', 'Jax', 'Zoe', 'Finn', 'Nala', 'Ryu', 'Skye'];
const commentTexts = ['Wow Wow!', 'Great shot!', 'I Love this!', 'Amazing picture', 'So cool.', 'Where is this?', 'Nice One!', 'Awesome view', 'We have to go there', 'What a picture', 'What a PROO', 'Continue with the great work!'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomId = () => Math.random().toString(36).substring(2, 9);
const getRandomName = (arr) => arr[getRandomInt(0, arr.length - 1)];

const CURRENT_USER_ID = 'u101';

const createMiniProfile = (idPrefix, userIdx, index) => {
    const randomName = getRandomName(names);
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

        let userId = `r${getRandomId()}`;
        while (usedUserIds.has(userId)) userId = `r${getRandomId()}`;
        usedUserIds.add(userId);

        const userFullname = `${randomName} ${getRandomName(['Rider', 'Hiker', 'Chef', 'Dev'])}`;
        const userImgUrl = `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${getRandomInt(1, 99)}.jpg`;

        const followerCount = getRandomInt(1, 10)
        const followingCount = getRandomInt(1, 10)
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

                // 🌟 FIX: Use a single, stable seed for both thumbnail and full image
                const imageSeed = `${userId}-${pIndex}-post`;

                return {
                    _id: postId,
                    // Use the same seed for both URLs to guarantee the same image content
                    thumbnailUrl: `https://picsum.photos/seed/${imageSeed}/300/300`,
                    imgUrl: `https://picsum.photos/seed/${imageSeed}/900/900`,
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

            following: Array.from({ length: followingCount }, (_, fIndex) => createMiniProfile('uF', i, fIndex)),
            followers: Array.from({ length: followerCount }, (_, fIndex) => createMiniProfile('uR', i, fIndex)),
            likedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
            savedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
        };

        detailedUsers.push(user);
    }
    return detailedUsers;
}

//  Generate Data Statically Once
//  Generate the set of random users
const MOCK_USERS = generateMockUsers(10);

//  Define the currently logged-in user with specific content (like in your screenshots)
const loggedInUser = {
    _id: CURRENT_USER_ID,
    username: 'james87',
    fullname: 'James Rider',
    imgUrl: 'https://randomuser.me/api/portraits/men/87.jpg', // User profile image
    bio: 'Welcome to my profile! Explorer of beautiful sights.',

    // Manually defined posts for James87 to ensure consistency
    posts: [
        {
            _id: `${CURRENT_USER_ID}-p0`,
            thumbnailUrl: `https://picsum.photos/seed/wolf-coyote/300/300`,
            imgUrl: `https://picsum.photos/seed/wolf-coyote/900/900`,
            txt: 'The desert guardian.',
            by: { _id: CURRENT_USER_ID, username: 'james87', fullname: 'James Rider', imgUrl: 'https://randomuser.me/api/portraits/men/87.jpg' },
            likedBy: Array.from({ length: 5 }, (_, lIndex) => createMiniProfile('pLike', CURRENT_USER_ID, lIndex)),
            comments: Array.from({ length: 3 }, (_, cIndex) => createMockComment(`${CURRENT_USER_ID}-p0`, cIndex)),
        },
        {
            _id: `${CURRENT_USER_ID}-p1`,
            thumbnailUrl: `https://picsum.photos/seed/grapes-hand/300/300`,
            imgUrl: `https://picsum.photos/seed/grapes-hand/900/900`,
            txt: 'Fresh harvest!',
            by: { _id: CURRENT_USER_ID, username: 'james87', fullname: 'James Rider', imgUrl: 'https://randomuser.me/api/portraits/men/87.jpg' },
            likedBy: Array.from({ length: 7 }, (_, lIndex) => createMiniProfile('pLike', CURRENT_USER_ID, lIndex)),
            comments: Array.from({ length: 4 }, (_, cIndex) => createMockComment(`${CURRENT_USER_ID}-p1`, cIndex)),
        },
        {
            _id: `${CURRENT_USER_ID}-p2`,
            thumbnailUrl: `https://picsum.photos/seed/window-birds/300/300`,
            imgUrl: `https://picsum.photos/seed/window-birds/900/900`,
            txt: 'A nice view from here.',
            by: { _id: CURRENT_USER_ID, username: 'james87', fullname: 'James Rider', imgUrl: 'https://randomuser.me/api/portraits/men/87.jpg' },
            likedBy: Array.from({ length: 2 }, (_, lIndex) => createMiniProfile('pLike', CURRENT_USER_ID, lIndex)),
            comments: Array.from({ length: 1 }, (_, cIndex) => createMockComment(`${CURRENT_USER_ID}-p2`, cIndex)),
        },
    ],
    following: Array.from({ length: 2 }, (_, i) => createMiniProfile('uF', CURRENT_USER_ID, i)),
    followers: Array.from({ length: 1 }, (_, i) => createMiniProfile('uR', CURRENT_USER_ID, i)),
    savedPostIds: [],
    likedPostIds: [],
};

// Create the final static array of all users
const ALL_USERS = [...MOCK_USERS.filter(u => u._id !== CURRENT_USER_ID), loggedInUser];

// Create a flat, static array of ALL posts for the post store
export const ALL_POSTS = ALL_USERS.flatMap(u => u.posts);


// Exported Service Functions
export const userService = {
    // This is now SAFE: it searches the static ALL_USERS array
    getByIdOrUsername: (id) => {
        return ALL_USERS.find(u => u._id === id || u.username === id)
    },
    getLoggedinUser: () => {
        return loggedInUser
    },
    // You might want a function to get all users
    getUsers: () => {
        return ALL_USERS
    }
};
