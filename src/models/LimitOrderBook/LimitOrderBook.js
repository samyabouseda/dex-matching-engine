import BinarySearchTree from './BinarySearchTree'

class LimitOrderBook {
	constructor() {
		this.bids = new BinarySearchTree()
		this.asks = new BinarySearchTree()
	}

	add(order) {
		return order.isBid()
			? this.executeBid(order)
			: this.executeAsk(order)
	}

	remove(order) {
		order.isBid()
			? this.bids.remove(order)
			: this.asks.remove(order)
		order.cancel()
		return order
	}

	executeBid(order) {
		const makers = this.asks.findMakersFor(order)
		if (!order.isFilled()) {
			this.bids.add(order)
		}
		return { taker: order, makers }
	}

	executeAsk(order) {
		const makers = this.bids.findMakersFor(order)
		if (!order.isFilled()) {
			this.asks.add(order)
		}
		return { taker: order, makers }
	}

	getLowestBidPrice() {
		const lowestBid = this.bids.getLowestPrice()
		return lowestBid === null ? 0 : lowestBid.limitPrice
	}

	getHighestAskPrice() {
		const highestAsk = this.asks.getHighestPrice()
		return highestAsk === null ? 0 : highestAsk.limitPrice
	}

	getBidsAsArray() {
		return this.bids.toArray()
	}

	getAsksAsArray() {
		return this.asks.toArray()
	}
}

export default LimitOrderBook
