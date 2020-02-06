import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	OK,
} from 'http-status-codes'
import OrderBookManager from '../models/OrderBookManager'

const getAll = async (req, res) => {
	try {
		const instruments = OrderBookManager.getInstruments()
		return res.status(OK).json({
			instruments,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const getById = async (req, res) => {
	try {
		let instrument = OrderBookManager.getInstrument(
			req.params.instrumentId,
		)
		return res.status(OK).json({
			instrument,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	getAll,
	getById,
}
