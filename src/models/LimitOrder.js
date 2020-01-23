import mongoose from 'mongoose'

class LimitOrder {
	constructor(side, limitPrice, nbOfShares) {
		this.id = this._generateObjectId()
		this.side = side
		this.limitPrice = limitPrice
		this.nbOfShares = nbOfShares
		this.entryTime = Date.now()
		this.previousOrder = null
		this.nextOrder = null

		this.equals = this.equals.bind(this)
	}

	_generateObjectId() { return mongoose.Types.ObjectId() }

	isBid() {
		return this.side === "bid"
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

	equals(obj) {
		if (obj instanceof LimitOrder) {
			return this.id === obj.id
				&& this.entryTime === obj.entryTime
				&& this.side === obj.side
				&& this.limitPrice === obj.limitPrice
				&& this.nbOfShares === obj.nbOfShares
		}
	}

}

export default LimitOrder