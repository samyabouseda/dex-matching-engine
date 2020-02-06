class LimitPrice {
	constructor(order, parent = null) {
		this.limitPrice = order.limitPrice
		this.volume = order.size
		this.headOrder = order
		this.leftChild = null
		this.rightChild = null
		this.parent = parent

		this.equals = this.equals.bind(this)
	}

	add(order) {
		if (order.limitPrice === this.limitPrice) {
			this.volume += order.size
			this.headOrder.setNext(order)
		} else if (order.limitPrice > this.limitPrice) {
			if (this.hasRightChild()) {
				this.rightChild.add(order)
			} else {
				this.rightChild = new LimitPrice(order, this)
			}
		} else {
			// order.limitPrice < this.limitPrice
			if (this.hasLeftChild()) {
				this.leftChild.add(order)
			} else {
				this.leftChild = new LimitPrice(order, this)
			}
		}
	}

	remove(order) {
		if (this.isTheOnlyOrderAtThisLimitPrice(order)) {
			return this.removeOnlyOrderAtThisLimitPrice()
		} else {
			return this.removeAnOrderAtThisLimitPrice(order)
		}
	}

	isTheOnlyOrderAtThisLimitPrice(order) {
		return this.headOrder === order && !this.headOrder.hasNext()
	}

	removeOnlyOrderAtThisLimitPrice() {
		if (this.isRoot()) {
			if (this.hasChildren()) {
				return this.removeLimitWithChildren()
			} else if (this.hasRightChild()) {
				let lowestLimit = this.rightChild.getLowest()
				this.replaceBy(lowestLimit)
				return true
			} else if (this.hasLeftChild()) {
				this.limitPrice = this.leftChild.limitPrice
				this.volume = this.leftChild.volume
				this.headOrder = this.leftChild.headOrder
				this.leftChild = this.leftChild.leftChild
				this.rightChild =
					this.rightChild !== null
						? this.rightChild.rightChild
						: null
				return true
			}
			return false
		} else {
			if (this.hasChildren()) {
				return this.removeLimitWithChildren()
			} else if (this.isTheLeftChild()) {
				this.parent.leftChild = this.hasLeftChild()
					? this.leftChild
					: this.rightChild
				return true
			} else if (this.isTheRightChild()) {
				this.parent.rightChild = this.hasRightChild()
					? this.leftChild
					: this.rightChild
				return true
			}
			return true
		}
	}

	removeLimitWithChildren() {
		let lowestLimit = this.rightChild.getLowest()
		this.replaceBy(lowestLimit)
		return true
	}

	removeAnOrderAtThisLimitPrice(order) {
		this.headOrder = this.headOrder.remove(order)
		return true
	}

	isRoot() {
		return this.parent === null
	}

	replaceBy(thatLimit) {
		this.limitPrice = thatLimit.limitPrice
		this.volume = thatLimit.volume
		this.headOrder = thatLimit.headOrder
		this.rightChild = thatLimit.rightChild
		if (this.leftChild) {
			thatLimit.leftChild = this.leftChild
		}
	}

	getLowest() {
		return this.hasLeftChild() ? this.leftChild.getLowest() : this
	}

	getHighest() {
		return this.hasRightChild()
			? this.rightChild.getHighest()
			: this
	}

	search(limitPrice) {
		if (limitPrice === this.limitPrice) {
			return this
		} else if (limitPrice < this.limitPrice) {
			if (this.hasLeftChild()) {
				return this.leftChild.search(limitPrice)
			}
		} else if (limitPrice > this.limitPrice) {
			if (this.hasRightChild()) {
				return this.rightChild.search(limitPrice)
			}
		} else {
			return null
		}
	}

	isTheLeftChild() {
		return this.parent.leftChild === this
	}

	isTheRightChild() {
		return this.parent.rightChild === this
	}

	hasChildren() {
		return this.hasRightChild() && this.hasLeftChild()
	}

	hasRightChild() {
		return this.rightChild !== null
	}

	hasLeftChild() {
		return this.leftChild !== null
	}

	equals(obj) {
		if (obj instanceof LimitPrice) {
			return this.limitPrice === obj.limitPrice
		}
	}
}

export default LimitPrice
