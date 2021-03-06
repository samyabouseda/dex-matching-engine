import { LimitOrder, LimitOrderBook } from './LimitOrderBook'

class OrderBookManager {
	constructor() {
		this._orderBooks = {}
	}

	registerNew(instrument) {
		this._orderBooks[instrument.address] = new LimitOrderBook()
	}

	has(instrument) {
		return this._orderBooks[instrument.address] !== undefined
	}

	add(order) {
		let orderBook = this._orderBooks[order.instrument]
		if (orderBook) {
			const limitOrder = new LimitOrder(
				order.side,
				order.limitPrice,
				order.size,
			)
			return orderBook.add(limitOrder)
		}
	}

	getInstruments() {
		let instruments = []
		for (let instrument in this._orderBooks) {
			let orderBook = this._orderBooks[instrument]
			instruments.push({
				instrument: instrument,
				lowestBid: orderBook.getLowestBidPrice(),
				highestAsk: orderBook.getHighestAskPrice(),
			})
		}
		return instruments
	}

	getInstrument(address) {
		let orderBook = this._orderBooks[address]
		if (orderBook) {
			return {
				instrument: {
					address: address,
					bids: orderBook.getBidsAsArray(),
					asks: orderBook.getAsksAsArray(),
					lowestBid: orderBook.getLowestBidPrice(),
					highestAsk: orderBook.getHighestAskPrice(),
				},
			}
		}
		return null
	}
}

const _instance = new OrderBookManager()
Object.freeze(_instance)

export default _instance
