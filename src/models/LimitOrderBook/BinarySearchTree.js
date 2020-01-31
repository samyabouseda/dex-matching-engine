import LimitPrice from './LimitPrice'

class BinarySearchTree {
	constructor(root = null) {
		this.root = root
	}

	add(order) {
		this.isEmpty()
			? (this.root = new LimitPrice(order))
			: this.root.add(order)
	}

	hasLimitOrders() {
		return !this.isEmpty()
	}

	isEmpty() {
		return this.root === null
	}

	getRoot() {
		return this.root
	}

	findMakersFor(order) {
		let makers = []
		if (this.hasLimitOrders()) {
			const limit = this.root.search(order.limitPrice)
			if (limit !== undefined) {
				let maker = limit.headOrder
				this.execute(order, maker)
				makers.push(maker)
				while (order.sizeRemaining > 0 && maker.hasNext()) {
					maker = maker.getNext()
					this.execute(order, maker)
					makers.push(maker)
				}
			}
		}
		return makers
	}

	execute(taker, maker) {
		if (taker.sizeRemaining > maker.sizeRemaining) {
			let takeSize = maker.sizeRemaining
			maker.setSizeRemaining(0)
			taker.setSizeRemaining(taker.sizeRemaining - takeSize)
		} else if (taker.sizeRemaining < maker.sizeRemaining) {
			let takeSize = taker.sizeRemaining
			maker.setSizeRemaining(maker.sizeRemaining - takeSize)
			taker.setSizeRemaining(0)
		} else {
			// taker.sizeRemaining === maker.sizeRemaining
			maker.setSizeRemaining(0)
			taker.setSizeRemaining(0)
		}
	}
}

export default BinarySearchTree
