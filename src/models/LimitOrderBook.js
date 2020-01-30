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
				if (this.root.headOrder.size === order.size) {
					return [this.root.headOrder]
				}
				// else if (this.root.headOrder.size < order.size) {
				// 	return [this.root.headOrder,] // TODO: partial fill return
				// } else {
				// 	return [this.root.headOrder, ] // TODO: complete fill left over
				// }
				return []



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
			const result = this.execute(order)
			if (result.taker.isFilled()) {
				return {
					status: "filled",
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

	execute(order) {
		// try to execute order
		// if order is executed fully return value is order with size zero
		// if order is executed partially return value is the order object with updated sizeRemaining
		// if order is not executed return value is the order
		const makers = this.asks.findMakersFor(order)
		return { // result
			taker: order,
			makers: makers,
			// sizeRemaining
		}
	}
}

export default LimitOrderBook
