import mongoose from 'mongoose'

class LimitOrder {
	constructor(side, limitPrice, size) {
		this.id = this._generateObjectId()
		this.side = side
		this.limitPrice = limitPrice
		this.size = size
		this.sizeRemaining = size
		this.entryTime = Date.now()
		this.previousOrder = null
		this.nextOrder = null

		this.equals = this.equals.bind(this)
	}

	_generateObjectId() { return mongoose.Types.ObjectId() }

	isBid() {
		return this.side === "bid"
	}

	isFilled() {
		return this.sizeRemaining === 0
	}

	setNext(order) {
		if (this.nextOrder === null) {
			this.nextOrder = order
			order.previousOrder = this
			return order
		} else {
			return this.nextOrder.setNext(order)
		}
	}

	getNext() {
		return this.nextOrder
	}

	hasNext() {
		return this.nextOrder !== null
	}

	equals(obj) {
		if (obj instanceof LimitOrder) {
			return this.id === obj.id
				&& this.entryTime === obj.entryTime
				&& this.side === obj.side
				&& this.limitPrice === obj.limitPrice
				&& this.size === obj.size
		}
	}

}

export default LimitOrder
