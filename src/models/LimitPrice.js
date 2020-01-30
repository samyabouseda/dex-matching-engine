class LimitPrice {
	constructor(order) {
		this.limitPrice = order.limitPrice
		this.volume = order.size
		this.headOrder = order
		this.tailOrder = null
		this.leftChild = null
		this.rightChild = null
	}

	add(order) {
		if (order.limitPrice === this.limitPrice) {
			this.volume += order.size
			this._setAsTail(order)
		} else {
			if (order.limitPrice > this.limitPrice) {
				if (this.hasRightChild()) {
					this.rightChild.add(order)
				} else {
					this.rightChild = new LimitPrice(order)
				}
			} else { // order.limitPrice < this.limitPrice
				if (this.hasLeftChild()) {
					this.leftChild.add(order)
				} else {
					this.leftChild = new LimitPrice(order)
				}
			}
		}
	}

	_setAsTail(order) {
		this.tailOrder = this.headOrder.setNext(order)
	}

	hasRightChild() {
		return this.rightChild !== null
	}

	hasLeftChild() {
		return this.leftChild !== null
	}
}

export default LimitPrice
