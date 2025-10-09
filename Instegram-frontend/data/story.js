export const story = {
	_id: 's101',
	txt: 'The sun is looking fire 🩷',
	imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
	by: {
		_id: 'u101',
		fullname: 'sunflower_power77',
		imgUrl: 'http: //some-img',
	},
	loc: {
		// Optional
		lat: 11.11,
		lng: 22.22,
		name: 'Lake Tahoe, California',
	},
	comments: [
		{
			id: 'c1001',
			by: {
				_id: 'u105',
				fullname: 'Bob',
				imgUrl: 'http: //some-img',
			},
			txt: 'good one!',
			likedBy: [ // Optional
				{
					_id: 'u105',
					fullname: 'Bob',
					imgUrl: 'http: //some-img',
				},
			],
		},
		{
			id: 'c1002',
			by: {
				_id: 'u106',
				fullname: 'Dob',
				imgUrl: 'http: //some-img',
			},
			txt: 'not good!',
		},
	],
	likedBy: [
		{
			_id: 'u105',
			fullname: 'Bob',
			imgUrl: 'http: //some-img',
		},
		{
			_id: 'u106',
			fullname: 'Dob',
			imgUrl: 'http: //some-img',
		},
	],
	tags: ['fun', 'romantic'
	],
}



export const user = {
	_id: 'u101',
	username: 'sunflower_power77',
	password: 'mukmuk',
	// bio: 'Hello World!',
	fullname: 'sunflower_power77 from CA.',
	imgUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg',
	posts: [
		{ _id: 'p101', thumbnailUrl: 'https://petapixel.com/assets/uploads/2024/01/The-Star-of-System-Sol-Rectangle-640x800.jpg', isVideo: false },
		{ _id: 'p102', thumbnailUrl: 'https://petapixel.com/assets/uploads/2021/03/sonya1pickfeat-800x420.jpg', isVideo: false },

	],

	following: [
		{
			_id: 'u106',
			fullname: 'Dob',
			imgUrl: 'http://some-img',
		},
	],
	followers: [
		{
			_id: 'u105',
			fullname: 'Bob',
			imgUrl: 'http://some-img',
		},
	],
	likedStoryIds: ['s105', 's122', 's173'], // can also use mini-stories { _id, imgUrl }
	savedStoryIds: ['s104', 's111', 's423'], // can also use mini-stories { _id, imgUrl }
}


// Feed


// const loggedinUser = usersCollection.find({ _id: loggedinUser._id })
// const following = loggedinUser.following.map(user => user._id)
// const feed = storiesCollection.find({ 'by._id': { $in: following } }).sort({ _id: -1 })


// const myPosts = storiesCollection.find({ 'by._id': loggedinUser._id }).sort({ _id: -1 })


