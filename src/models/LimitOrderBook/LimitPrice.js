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

	remove(order) {
		if (this.headOrder === order) {
			if (this.hasChildren()) {
				let lowestLimit = this.rightChild.getLowest()
				this.replaceBy(lowestLimit)
			} else if (this.parent.leftChild === this) {
				this.parent.leftChild = this.hasLeftChild()
					? this.leftChild
					: this.rightChild
			} else if (this.parent.rightChild === this) {
				this.parent.rightChild = this.hasRightChild()
					? this.leftChild
					: this.rightChild
			}
			return false
		} else {
			this.headOrder.remove()
		}
	}

	replaceBy(thatLimit) {
		this.limitPrice = thatLimit.limitPrice
		this.volume = thatLimit.volume
		this.headOrder = thatLimit.headOrder
		this.rightChild = thatLimit.rightChild
	}

	getLowest() {
		return this.hasLeftChild() ? this.leftChild.getLowest() : this
	}

	getHighest() {
		return this.hasRightChild()
			? this.rightChild.getHighest()
			: this
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
