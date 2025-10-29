import { storageService } from "./async-storage.service";
import { loadFromStorage, makeId, saveToStorage } from "./util";

const POST_KEY = 'POST_DB'
_createPosts()

const tags = [
    'adventure',
    'coding',
    'photography',
    'fun',
    'books',
    'romantic',
    'art',
]

// postservice export
export const postService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    getEmptyPost,
    getDefaultSort,
    getPostTags,
    getPostTagCounts,
    toggleLike,
    addComment,
    toggleCommentLike
}

// =====================
// Public functions
// =====================

function query(filterBy = {}, sortBy = {}) {
    return storageService.query(POST_KEY)
        .then(posts => {
            // Filter by text
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                posts = posts.filter(post => regExp.test(post.name))
            }
            // Filter by tags
            if (filterBy.tags?.length) {
                posts = posts.filter(post =>
                    filterBy.tags.every(tag => post.tags.includes(tag)))
            }
            return posts
        })
}

function getById(postId) {
    return storageService.get(POST_KEY, postId)
}

function remove(postId) {
    return storageService.remove(POST_KEY, postId)
}

function save(post) {
    if (post._id) {
        return storageService.put(POST_KEY, post)
    } else {
        post._id = makeId()
        post.createdAt = Date.now()
        return storageService.post(POST_KEY, post)
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        tags: [],
    }
}

function getDefaultSort() {
    return { type: '', desc: 1 }
}

function getEmptyPost() {
    return {
        _id: makeId(),               // unique id for the post
        txt: '',                     // post title or text
        imgUrl: '',                  // image URL
        tags: _getRandomTags(),      // tags array
        createdAt: Date.now(),       // timestamp
        by: {                        // author info
            _id: '',
            fullname: '',
            imgUrl: '',
        },
        loc: {                       // optional location
            lat: null,
            lng: null,
            name: '',
        },
        comments: [],                // comments array
        likedBy: [],                 // users who liked the post
    }
}


function getPostTags() {
    return Promise.resolve(tags)
}

function getPostTagCounts() {
    return storageService.query(POST_KEY).then(posts => {
        const tagCounts = {}
        posts.forEach(post => {
            post.tags.forEach(tag => {
                if (!tagCounts[tag]) tagCounts[tag] = 0
                tagCounts[tag]++
            })
        })
        return tagCounts
    })
}

// Toggle like for a post by a user
function toggleLike(postId, userId) {
    return getById(postId).then(post => {
        if (!post) return Promise.reject('Post not found')

        const idx = post.likedBy.findIndex(user => user._id === userId)
        if (idx === -1) {
            // Add like
            post.likedBy.push({ _id: userId })
        } else {
            // Remove like
            post.likedBy.splice(idx, 1)
        }

        return save(post)
    })
}

// Add comment to a post
function addComment(postId, comment) {
    return getById(postId).then(post => {
        if (!post) return Promise.reject('Post not found')

        post.comments.push(comment)
        return save(post)
    })
}
function toggleCommentLike(postId, commentId, userId) {
    return getById(postId).then(post => {
        if (!post) return Promise.reject('Post not found')

        // Find the comment (support older data that used 'id' instead of '_id')
        const comment = post.comments.find(c => c._id === commentId || c.id === commentId)

        if (!comment) return Promise.reject('Comment not found')

        //  Initialize likedBy if it doesn't exist (important for old data)
        if (!comment.likedBy) comment.likedBy = []

        // Check if user already liked the comment
        const likedBy = comment.likedBy
        const userIdx = likedBy.findIndex(user => user._id === userId)

        if (userIdx === -1) {
            // Add like: we only need the user ID here for service layer
            likedBy.push({ _id: userId })
        } else {
            // Remove like
            likedBy.splice(userIdx, 1)
        }

        // Save the updated post (which contains the updated comment)
        return save(post)
    })
}



// Private functions
function _createPosts() {
    let posts = loadFromStorage(POST_KEY)
    if (!posts || !posts.length) {
        posts = [
            {
                _id: 'p101',
                txt: 'The sun is looking fire 🩷',
                imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
                by: {
                    _id: 'u101',
                    fullname: 'sunflower_power77',
                    imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
                },
                loc: {
                    lat: 11.11,
                    lng: 22.22,
                    name: 'Lake Tahoe, California',
                },
                comments: [
                    {
                        id: 'c1001',
                        by: { _id: 'u105', fullname: 'Bob', imgUrl: 'http://some-img' },
                        txt: 'good one!',
                        likedBy: [{ _id: 'u105', fullname: 'Bob', imgUrl: 'http://some-img' }],
                    },
                    {
                        id: 'c1002',
                        by: { _id: 'u106', fullname: 'Dob', imgUrl: 'http://some-img' },
                        txt: 'not good!',
                    },
                ],
                likedBy: [
                    { _id: 'u105', fullname: 'Bob', imgUrl: 'http://some-img' },
                    { _id: 'u106', fullname: 'Dob', imgUrl: 'http://some-img' },
                ],
                tags: ['fun', 'romantic'],
                createdAt: Date.now(),
            }
        ]
        saveToStorage(POST_KEY, posts)
    }
}

function _getRandomTags() {
    const tagsCopy = [...tags]
    const randomTags = []
    const count = Math.min(2, tagsCopy.length)
    for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * tagsCopy.length)
        randomTags.push(tagsCopy.splice(idx, 1)[0])
    }
    return randomTags
}
