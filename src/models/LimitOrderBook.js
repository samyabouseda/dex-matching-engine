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
		if (this.isEmpty()) {
			this.root = new LimitPrice(order)
			return true
		} else {
			return this.root.add(order)
		}
	}

	isEmpty() {
		return this.root === null
	}

	getRoot() {
		return this.root
	}

	findMakersFor(order) {
		if (this.isEmpty()) {
			return []
		} else {
			if (order.limitPrice === this.root.limitPrice) { // limitPriceMatch

				let makers = [this.root.headOrder]
				let sizeCount = this.root.headOrder.size
				let currentOrder = this.root.headOrder
				while (sizeCount < order.size && currentOrder.hasNext()) {
					currentOrder = currentOrder.getNext()
					sizeCount += currentOrder.size
					makers.push(currentOrder)
				}
				return makers

			} else if (order.limitPrice < this.root.limitPrice) {
				if (this.root.leftChild === null) { // hasLeftChild
					return []
				} else {
					return this.root.leftChild.findMakersFor(order)
				}
			} else if (order.limitPrice > this.root.limitPrice) {
				if (this.root.rightChild === null) { // hasRightChild
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
	}

	add(order) {
		if (order.isBid()) {
			const result = this.executeBid(order)
			if (result.taker.isFilled()) {
				return {
					status: "filled", // should be set in execute()
					result: result
				}
			} else {
				this.bids.add(result.taker)
				return {
					status: "queued",
					result: result,
				}
			}
		} else { // order.side.isAsk
			// TODO: Check for a match on the other side.
			return this.asks.add(order)
		}
	}

	executeBid(order) {
		// try to execute order
		// if order is executed fully return value is order with size zero
		// if order is executed partially return value is the order object with updated sizeRemaining
		// if order is not executed return value is the order
		// TODO: do the same for the bids
		const makers = this.asks.findMakersFor(order)

		if (makers.length === 0) {
			return {
				status: "queued",
				taker: order,
				makers: makers,
			}
		} else {
			let _makers = [...makers]
			while(order.sizeRemaining > 0 && _makers.length > 0) {
				const maker = _makers.shift()
				const taker = order
				if (taker.sizeRemaining > maker.sizeRemaining) {
					let takeSize = maker.sizeRemaining
					maker.sizeRemaining = 0
					taker.sizeRemaining -= takeSize
				} else if (taker.sizeRemaining < maker.sizeRemaining) {
					let takeSize = taker.sizeRemaining
					maker.sizeRemaining -= takeSize
					taker.sizeRemaining = 0
				} else { // taker.sizeRemaining === maker.sizeRemaining
					maker.sizeRemaining = 0
					taker.sizeRemaining = 0
				}
			}
			if (order.sizeRemaining > 0) {
				return {
					status: "partially-filled",
					taker: order,
					makers: makers,
				}
			} else {
				return {
					status: "filled",
					taker: order,
					makers: makers,
				}
			}
		}
	}
}

export default LimitOrderBook
