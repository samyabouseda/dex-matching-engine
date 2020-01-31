import mongoose from 'mongoose'

class LimitOrder {
	constructor(side, limitPrice, size) {
		this.id = this._generateObjectId()
		this.side = side
		this.limitPrice = limitPrice
		this.size = size
		this.sizeRemaining = size
		this.entryTime = Date.now()
		this.status = 'queued'
		this.previousOrder = null
		this.nextOrder = null

		this.equals = this.equals.bind(this)
	}

	_generateObjectId() {
		return mongoose.Types.ObjectId()
	}

	isBid() {
		return this.side === 'bid'
	}

	isFilled() {
		return this.sizeRemaining === 0
	}

	setSizeRemaining(sizeRemaining) {
		this.sizeRemaining = sizeRemaining
		if (sizeRemaining === 0) {
			this.status = 'filled'
		} else {
			this.status = 'partially-filled'
		}
	}

	remove(order) {
		if (this === order) {
			if (order.previousOrder !== null) {
				order.previousOrder.nextOrder = order.nextOrder
			}
			if (order.nextOrder !== null) {
				order.nextOrder.previousOrder = order.previousOrder
			}
			return this.nextOrder
		} else {
			if (this.hasNext()) {
				return this.nextOrder.remove(order)
			}
		}
		return null
	}

	setNext(order) {
		if (this.hasNext()) {
			return this.nextOrder.setNext(order)
		} else {
			this.nextOrder = order
			order.previousOrder = this
			return order
		}
	}

	hasNext() {
		return this.nextOrder !== null
	}

	getNext() {
		return this.nextOrder
	}

	equals(obj) {
		if (obj instanceof LimitOrder) {
			return (
				this.id === obj.id &&
				this.entryTime === obj.entryTime &&
				this.side === obj.side &&
				this.limitPrice === obj.limitPrice &&
				this.size === obj.size
			)
		}
	}
}

export default LimitOrder
