import LimitOrderBook from './LimitOrderBook'
import LimitOrder from './LimitOrder'

describe('OrderBook', () => {
	let orderBook = new LimitOrderBook()
	let order1 = new LimitOrder("bid", 13.37, 10)
	let order2 = new LimitOrder("bid", 13.38, 10)
	let order3 = new LimitOrder("bid", 13.34, 10)
	let order4 = new LimitOrder("bid", 13.39, 10)
	let order5 = new LimitOrder("bid", 13.89, 10)
	let order6 = new LimitOrder("bid", 13.35, 10)
	let order7 = new LimitOrder("bid", 13.37, 7)
	let order8 = new LimitOrder("bid", 13.36, 10)
	let order9 = new LimitOrder("bid", 13.37, 4)
	let order10 = new LimitOrder("ask", 13.33, 10)
	let order11 = new LimitOrder("ask", 13.32, 10)
	let order12 = new LimitOrder("ask", 13.30, 10)
	let order13 = new LimitOrder("ask", 13.25, 10)
	let order14 = new LimitOrder("ask", 13.33, 10)
	let order15 = new LimitOrder("ask", 13.33, 10)
	orderBook.add(order1)
	orderBook.add(order2)
	orderBook.add(order3)
	orderBook.add(order4)
	orderBook.add(order5)
	orderBook.add(order6)
	orderBook.add(order7)
	orderBook.add(order8)
	orderBook.add(order9)
	orderBook.add(order10)
	orderBook.add(order11)
	orderBook.add(order12)
	orderBook.add(order13)
	orderBook.add(order14)
	orderBook.add(order15)

	// BIDS
	describe('first sell limit order created', () => {
		it('should be the head order of the root of the sell tree', () => {
			expect(orderBook.bids.headOrder).toEqual(order1)
		})
	})
	describe('second sell limit order created', () => {
		it('should be the head order of the right child of the root', () => {
			expect(orderBook.bids.rightChild.headOrder).toEqual(order2)
		})
	})

	describe('third sell limit order created', () => {
		it('should be the head order of the left child of the root', () => {
			expect(orderBook.bids.leftChild.headOrder).toEqual(order3)
		})
	})

	describe('second sell limit order at the same limit price', () => {
		it('should be added as next order of the head order', () => {
			expect(order1.nextOrder).toEqual(order7)
		})

		it('should have the third order at the same limit price as next order', () => {
			expect(order7.nextOrder).toEqual(order9)
		})

		it('should have the head order as previous order', () => {
			expect(order7.previousOrder).toEqual(order1)
		})
	})

	describe('third sell limit order at the same limit price', () => {
		it('should be added as next order of the second order at the same limit price', () => {
			expect(order7.nextOrder).toEqual(order9)
		})

		it('should have the second order at the same limit price as previous order', () => {
			expect(order9.previousOrder).toEqual(order7)
		})

		it('should have the next order set to null', () => {
			expect(order9.nextOrder).toBe(null)
		})
	})

	// ASKS
	describe('first buy limit order created', () => {
		it('should be the head order of the root of the buy tree', () => {
			expect(orderBook.asks.headOrder).toEqual(order10)
		})
	})

	describe('third buy limit order at the same limit price', () => {
		it('should be added as next order of the second order at the same limit price', () => {
			expect(order14.nextOrder).toEqual(order15)
		})

		it('should have the second order at the same limit price as previous order', () => {
			expect(order15.previousOrder).toEqual(order14)
		})

		it('should have the next order set to null', () => {
			expect(order15.nextOrder).toBe(null)
		})
	})
})
