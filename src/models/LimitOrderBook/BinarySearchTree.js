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

	remove(order) {
		if (this.hasLimitOrders()) {
			const limit = this.root.search(order.limitPrice)
			if (limit !== null) {
				const res = limit.remove(order)
				if (res === false) {
					this.root = null
				}
			}
			return true
		}
		return false
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
		if (maker.sizeRemaining === 0) {
			this.remove(maker)
		}
	}

	getLowestPrice() {
		if (this.hasLimitOrders()) {
			return this.root.getLowest()
		}
		return null
	}

	getHighestPrice() {
		if (this.hasLimitOrders()) {
			return this.root.getHighest()
		}
		return null
	}

	toArray() {
		this.array = []
		this._inOrderTraversal(this.root)
		return this.array
	}

	_inOrderTraversal(node) {
		if (node !== null) {
			this._inOrderTraversal(node.leftChild)
			this.array.push(node)
			this._inOrderTraversal(node.rightChild)
		}
	}
}

export default BinarySearchTree
