// utils.service.js

// Generates a random ID
export function makeId(length = 6) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

// Generates random lorem text for posts
export function makeLorem(size = 50) {
    const words = [
        'adventure', 'coding', 'photography', 'fun', 'books', 'romantic', 'art',
        'life', 'journey', 'sun', 'moon', 'happy', 'love', 'nature', 'travel',
        'explore', 'post', 'memory', 'beautiful', 'moment', 'smile', 'friend'
    ]
    let txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt.trim()
}

// Generates random names for posts or users
export function makeName(size = 2) {
    const words = [
        'Sun', 'Moon', 'Star', 'Ocean', 'River', 'Sky', 'Dream', 'Pixel',
        'Light', 'Shadow', 'Fire', 'Wind', 'Tree', 'Cloud', 'Stone', 'Rose'
    ]
    let txt = ''
    for (let i = 0; i < size; i++) {
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt.trim()
}

// Save data to localStorage
export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// Load data from localStorage
export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
}

// Debounce function
export function debounce(func, delay) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

export function timeAgo(timestamp) {
    const now = Date.now()
    const seconds = Math.floor((now - timestamp) / 1000)

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y"
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "m"
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d"
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h"
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m"
    }
    return Math.floor(seconds) + "s"
}

// 5. DETAILED USER GENERATION FUNCTION
export const generatekUsers = (count = 10) => {
    const detailedUsers = [];
    const usedUsernames = new Set();

    for (let i = 0; i < count; i++) {
        const randomName = getRandomName(names);
        let username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        while (usedUsernames.has(username) || username === MOCK_CURRENT_USER.username) {
            username = `${randomName.toLowerCase()}${getRandomInt(10, 99)}`;
        }
        usedUsernames.add(username);

        const userId = `r${i + 1}${getRandomId()}`;
        const followerCount = getRandomInt(5, 10);
        const followingCount = getRandomInt(2, 5);
        const postCount = getRandomInt(3, 5);

        const user = {
            _id: userId,
            username: username,
            // Mock password/bio are omitted as they are not needed for UI
            fullname: `${randomName} ${getRandomName(['Rider', 'Hiker', 'Chef', 'Dev', 'Mare', 'joe'])}`,
            imgUrl: `https://placehold.co/60x60/${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}/FFFFFF?text=${randomName[0]}`,

            posts: Array.from({ length: postCount }, (_, pIndex) => ({
                _id: `p${getRandomId()}${pIndex}`,
                thumbnailUrl: `https://placehold.co/300x300/FCA5A5/FFFFFF?text=Post${pIndex + 1}`,
                isVideo: Math.random() < 0.2, // 20% chance of being a video
            })),

            following: Array.from({ length: followingCount }, (_, fIndex) => createMiniProfile('uF', fIndex)),

            followers: Array.from({ length: followerCount }, (_, fIndex) => createMiniProfile('uR', fIndex)),

            likedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
            savedPostIds: Array.from({ length: getRandomInt(3, 5) }, () => `s${getRandomId()}`),
        };

        detailedUsers.push(user);
    }
    return detailedUsers;
};