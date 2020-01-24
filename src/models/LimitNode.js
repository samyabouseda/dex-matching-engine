
class LimitNode {
	constructor(order) {
		this.limitPrice = order.limitPrice
		this.volume = order.size
		this.headOrder = order
		this.tailOrder = null
		this.leftChild = null
		this.rightChild = null

		this.add = this.add.bind(this)
		this._setAsTail = this._setAsTail.bind(this)
		this.match = this.match.bind(this)
	}

	add(order) {
		if (order.limitPrice === this.limitPrice) {
			this.volume += order.size
			this._setAsTail(order)
		} else {
			if (order.limitPrice > this.limitPrice) {
				if (this.rightChild == null) {
					this.rightChild = new LimitNode(order) // TODO: Should also pass this
				} else { // this.rightChild exists
					this.rightChild.add(order)
				}
			} else { // order.limitPrice < this.limitPrice
				if (this.leftChild == null) {
					this.leftChild = new LimitNode(order)
				} else { // this.leftChild exists
					this.leftChild.add(order)
				}
			}
		}
	}
	
	_setAsTail(order) {
		this.tailOrder = this.headOrder.setNext(order)
	}

	match(order) {
		if (order.side === "bid") {
			if (this.limitPrice === order.limitPrice) {
				// console.log(this.headOrder)
				// console.log(order)
				// console.log(this)
				// this.headOrder = this.headOrder.nextOrder

				//execute
				// promoteNextAsRoot
				// if (this.rightChild === null) {
				// 	if (this.leftChild === null) {
				// 		return null
				// 	}
				// }
				return {
					taker: order,
					makers: [this.headOrder], // multi makers
					takeSize: order.size, // partial, full, remainder
				}
			}
		}
		return {}
	}
}

export default LimitNode