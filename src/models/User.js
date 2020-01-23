import { Schema, model } from 'mongoose'

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
})

userSchema.statics.findByLogin = async function(login) {
	let user = await this.findOne({
		username: login,
	})

	if (!user) {
		user = await this.findOne({ email: login })
	}

	return user
}

userSchema.pre('remove', next =>
	this.model('Message').deleteMany({ user: this._id }, next),
)

const User = model('User', userSchema)

export default User
