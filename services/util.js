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
        'explore', 'story', 'memory', 'beautiful', 'moment', 'smile', 'friend'
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
