import LimitPrice from './LimitPrice'

class BinarySearchTree {
	constructor(root = null) {
		this.root = root
		this.isEmpty = this.isEmpty.bind(this)
		this.add = this.add.bind(this)
		this.getRoot = this.getRoot.bind(this)
		this.findMakersFor = this.findMakersFor.bind(this)
	}

	add(order) {
		this.isEmpty()
			? (this.root = new LimitPrice(order))
			: this.root.add(order)
	}

	isEmpty() {
		return this.root === null
	}

	getRoot() {
		return this.root
	}

	findMakersFor(order) {
		if (!this.isEmpty()) {
			const limit = this.root.search(order.limitPrice)
			if (limit !== undefined) {
				let makers = [limit.headOrder]
				let sizeCount = limit.headOrder.size
				let currentOrder = limit.headOrder
				while (
					sizeCount < order.size &&
					currentOrder.hasNext()
				) {
					currentOrder = currentOrder.getNext()
					sizeCount += currentOrder.size
					makers.push(currentOrder)
				}
				return makers
			}
		}
		return []
	}
}

class LimitOrderBook {
	constructor() {
		this.bids = new BinarySearchTree()
		this.asks = new BinarySearchTree()

		this.add = this.add.bind(this)
		this.executeBid = this.executeBid.bind(this)
		this.executeAsk = this.executeAsk.bind(this)
	}

	add(order) {
		return order.isBid()
			? this.executeBid(order)
			: this.executeAsk(order)
	}

	executeBid(order) {
		const makers = this.asks.findMakersFor(order)
		const result = this.execute(order, makers)
		if (!order.isFilled()) {
			this.bids.add(order)
		}
		return result
	}

	executeAsk(order) {
		const makers = this.bids.findMakersFor(order)
		const result = this.execute(order, makers)
		if (!order.isFilled()) {
			this.asks.add(order)
		}
		return result
	}

	execute(order, makers) {
		let _makers = [...makers]
		if (makers.length > 0) {
			while (order.sizeRemaining > 0 && _makers.length > 0) {
				const maker = _makers.shift()
				const taker = order
				if (taker.sizeRemaining > maker.sizeRemaining) {
					let takeSize = maker.sizeRemaining
					maker.setSizeRemaining(0)
					taker.setSizeRemaining(
						taker.sizeRemaining - takeSize,
					)
				} else if (
					taker.sizeRemaining < maker.sizeRemaining
				) {
					let takeSize = taker.sizeRemaining
					maker.setSizeRemaining(
						maker.sizeRemaining - takeSize,
					)
					taker.setSizeRemaining(0)
				} else {
					// taker.sizeRemaining === maker.sizeRemaining
					maker.setSizeRemaining(0)
					taker.setSizeRemaining(0)
				}
			}
		}
		return { taker: order, makers }
	}
}

export default LimitOrderBook
