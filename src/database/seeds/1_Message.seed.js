module.exports = {
	model: 'Message',
	foreignKeys: {
		user: {
			model: 'User',
			field: 'id',
		},
	},
	data: [
		{
			user: "000000000000000000000001",
			text: 'Hello world!',
		},
		{
			user: "000000000000000000000001",
			text: 'Hello again!',
		},
		{
			user: "000000000000000000000002",
			text: 'Hi! How are you ?',
		},
	],
}
