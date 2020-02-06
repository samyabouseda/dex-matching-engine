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
}

export default LimitOrderBook
