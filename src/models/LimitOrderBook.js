import Limit from './Limit'

class LimitOrderBook {
	constructor() {
		this.bids = null // buyTree of type Limit
		this.asks = null // sellTree of type Limit

		this.add = this.add.bind(this)
	}

	add(order) {
		if (order.isBid()) {
			if (this.bids === null) {
				this.bids = new Limit(order)
			} else {
				this.bids.add(order)
			}
		} else { // order.side.isAsk
			if (this.asks === null) {
				this.asks = new Limit(order)
			} else {
				this.asks.add(order)
			}
		}
	}
}

export default LimitOrderBook