class Limit {
	constructor(order) {
		this.limitPrice = order.limitPrice
		this.volume = order.nbOfShares
		this.headOrder = order
		this.parentNode = null // if null then it is the root node.
		this.tailOrder = null
		this.leftChild = null
		this.rightChild = null

		this.add = this.add.bind(this)
		this._setAsTail = this._setAsTail.bind(this)
	}

	add(order) {
		if (order.limitPrice === this.limitPrice) {
			this.volume += order.nbOfShares
			this._setAsTail(order)
		} else {
			if (order.limitPrice > this.limitPrice) {
				if (this.rightChild == null) {
					this.rightChild = new Limit(order) // TODO: Should also pass this
				} else { // this.rightChild exists
					this.rightChild.add(order)
				}
			} else { // order.limitPrice < this.limitPrice
				if (this.leftChild == null) {
					this.leftChild = new Limit(order)
				} else { // this.leftChild exists
					this.leftChild.add(order)
				}
			}
		}
	}
	
	_setAsTail(order) {
		this.tailOrder = this.headOrder.setNext(order)
	}
}

export default Limit