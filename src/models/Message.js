import { Schema, model } from 'mongoose'

const schema = new Schema({
	text: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true,
	},
})

const Message = model('Message', schema)

export default Message
