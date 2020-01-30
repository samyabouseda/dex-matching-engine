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
		// TODO: Refactor
		if (this.isEmpty()) {
			return []
		} else {
			if (order.limitPrice === this.root.limitPrice) {
				// limitPriceMatch

				let makers = [this.root.headOrder]
				let sizeCount = this.root.headOrder.size
				let currentOrder = this.root.headOrder
				while (
					sizeCount < order.size &&
					currentOrder.hasNext()
				) {
					currentOrder = currentOrder.getNext()
					sizeCount += currentOrder.size
					makers.push(currentOrder)
				}
				return makers
			} else if (order.limitPrice < this.root.limitPrice) {
				if (this.root.leftChild === null) {
					// hasLeftChild
					return []
				} else {
					return this.root.leftChild.findMakersFor(order)
				}
			} else if (order.limitPrice > this.root.limitPrice) {
				if (this.root.rightChild === null) {
					// hasRightChild
					return []
				} else {
					return this.root.rightChild.findMakersFor(order)
				}
			}
			return []
		}
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
		const { makers, taker } = this.execute(order)
		if (!order.isFilled()) {
			this.bids.add(order)
		}
		return {
			taker: taker,
			makers: makers,
		}
	}

	executeAsk(order) {
		// TODO
		return this.asks.add(order)
	}

	execute(order) {
		const makers = this.asks.findMakersFor(order)
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
		return { makers, taker: order }
	}
}

export default LimitOrderBook
