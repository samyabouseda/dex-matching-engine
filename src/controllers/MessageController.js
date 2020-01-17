import {
	CREATED,
	INTERNAL_SERVER_ERROR,
	OK,
	NO_CONTENT,
} from 'http-status-codes'

const create = async (req, res) => {
	try {
		const message = await req.context.models.Message.create({
			text: req.body.text,
			user: req.body.id,
		})
		return res.status(CREATED).json({
			message,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const getAll = async (req, res) => {
	const messages = await req.context.models.Message.find()
	return res.send(messages)
}

const getById = async (req, res) => {
	const message = await req.context.models.Message.findById(
		req.params.messageId,
	)
	return res.send(message)
}

const update = () => {}

const remove = async (req, res) => {
	const message = await req.context.models.Message.findById(
		req.params.messageId,
	)
	let result = null
	if (message) {
		result = await message.remove()
	}
	return res.send(result)
}

export default {
	create,
	getAll,
	getById,
	update,
	remove,
}
