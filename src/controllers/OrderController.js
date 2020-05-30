import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	OK,
	REQUEST_URI_TOO_LONG,
} from 'http-status-codes'
import OrderBookManager from '../models/OrderBookManager'

const placeOrder = async (req, res) => {
	try {
		const result = OrderBookManager.add(req.body.order)
		const order = {
			limitPrice: result.taker.limitPrice,
			size: result.taker.size,
			sizeRemaining: result.taker.sizeRemaining,
			status: result.taker.status,
			side: result.taker.side,
			entryTime: result.taker.entryTime,
			id: result.taker.id,
		}
		return res.status(CREATED).json({
			order,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	placeOrder,
}
