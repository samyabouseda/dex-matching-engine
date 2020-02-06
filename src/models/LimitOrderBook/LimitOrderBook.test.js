import { LimitOrderBook, LimitOrder } from './index'

describe('OrderBook', () => {
	let orderBook = new LimitOrderBook()
	let order1 = new LimitOrder('bid', 13.38, 10)
	let order2 = new LimitOrder('bid', 13.37, 10)
	let order3 = new LimitOrder('bid', 13.41, 10)
	let order4 = new LimitOrder('bid', 13.39, 10)
	let order5 = new LimitOrder('bid', 13.89, 10)
	let order6 = new LimitOrder('bid', 13.42, 10)
	let order7 = new LimitOrder('bid', 13.37, 7)
	let order8 = new LimitOrder('bid', 13.4, 10)
	let order9 = new LimitOrder('bid', 13.37, 4)
	let order10 = new LimitOrder('ask', 13.33, 10)
	let order11 = new LimitOrder('ask', 13.32, 10)
	let order12 = new LimitOrder('ask', 13.3, 10)
	let order13 = new LimitOrder('ask', 13.25, 10)
	let order14 = new LimitOrder('ask', 13.33, 10)
	let order15 = new LimitOrder('ask', 13.33, 10)
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
	describe(`first sell limit order created (${order1.limitPrice})`, () => {
		it('should be the head order of the root of the sell tree', () => {
			expect(orderBook.bids.getRoot().headOrder).toEqual(order1)
		})
	})

	describe(`second sell limit order created (${order2.limitPrice})`, () => {
		it('should be the head order of the left child of the root', () => {
			expect(
				orderBook.bids.getRoot().leftChild.headOrder,
			).toEqual(order2)
		})
	})

	describe(`third sell limit order created (${order3.limitPrice})`, () => {
		it('should be the head order of the right child of the root', () => {
			expect(
				orderBook.bids.getRoot().rightChild.headOrder,
			).toEqual(order3)
		})
	})

	describe(`second sell limit order at the same limit price (${order7.limitPrice})`, () => {
		it('should be added as next order of the head order', () => {
			expect(order2.nextOrder).toEqual(order7)
		})

		it('should have the third order at the same limit price as next order', () => {
			expect(order7.nextOrder).toEqual(order9)
		})

		it('should have the head order as previous order', () => {
			expect(order7.previousOrder).toEqual(order2)
		})
	})

	describe(`third sell limit order at the same limit price (${order9.limitPrice})`, () => {
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
	describe(`first buy limit order created (${order9.limitPrice})`, () => {
		it('should be the head order of the root of the buy tree', () => {
			expect(orderBook.asks.getRoot().headOrder).toEqual(
				order10,
			)
		})
	})

	describe(`third buy limit order at the same limit price (${order15.limitPrice})`, () => {
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

describe('Matching', () => {
	it('one-to-one complete fill', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 5)
		let order2 = new LimitOrder('bid', 13.38, 5)
		let order3 = new LimitOrder('bid', 13.11, 55)
		let order4 = new LimitOrder('ask', 13.11, 55)
		orderBook.add(order1)
		let result = orderBook.add(order2)
		expect(result.taker).toEqual(order2)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(1)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[0].status).toBe('filled')

		orderBook.add(order3)
		result = orderBook.add(order4)
		expect(result.taker).toEqual(order4)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(1)
		expect(result.makers[0]).toEqual(order3)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[0].status).toBe('filled')
	})

	it('one-to-one complete fill with leftovers', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 10)
		let order2 = new LimitOrder('bid', 13.38, 5)
		orderBook.add(order1)
		const result = orderBook.add(order2)
		expect(result.taker).toEqual(order2)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(1)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[0].sizeRemaining).toBe(5)
		expect(result.makers[0].status).toBe('partially-filled')
	})

	it('one-to-many complete fill', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 1)
		let order2 = new LimitOrder('ask', 13.38, 2)
		let order3 = new LimitOrder('ask', 13.38, 4)
		let order4 = new LimitOrder('ask', 13.38, 3)
		let order5 = new LimitOrder('bid', 13.38, 10)
		orderBook.add(order1)
		orderBook.add(order2)
		orderBook.add(order3)
		orderBook.add(order4)
		const result = orderBook.add(order5)
		expect(result.taker).toEqual(order5)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(4)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[1]).toEqual(order2)
		expect(result.makers[2]).toEqual(order3)
		expect(result.makers[3]).toEqual(order4)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[0].status).toBe('filled')
		expect(result.makers[1].sizeRemaining).toBe(0)
		expect(result.makers[1].status).toBe('filled')
		expect(result.makers[2].sizeRemaining).toBe(0)
		expect(result.makers[2].status).toBe('filled')
		expect(result.makers[3].sizeRemaining).toBe(0)
		expect(result.makers[3].status).toBe('filled')
	})

	it('one-to-many complete fill with leftovers', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 1)
		let order2 = new LimitOrder('ask', 13.38, 2)
		let order3 = new LimitOrder('ask', 13.38, 4)
		let order4 = new LimitOrder('ask', 13.38, 8)
		let order5 = new LimitOrder('bid', 13.38, 10)
		orderBook.add(order1)
		orderBook.add(order2)
		orderBook.add(order3)
		orderBook.add(order4)
		const result = orderBook.add(order5)
		expect(result.taker).toEqual(order5)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(4)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[1]).toEqual(order2)
		expect(result.makers[2]).toEqual(order3)
		expect(result.makers[3]).toEqual(order4)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[1].sizeRemaining).toBe(0)
		expect(result.makers[2].sizeRemaining).toBe(0)
		expect(result.makers[3].sizeRemaining).toBe(5)
	})

	it('one-to-one partial fill', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 100)
		let order2 = new LimitOrder('bid', 13.38, 250)
		orderBook.add(order1)
		const result = orderBook.add(order2)
		expect(result.taker).toEqual(order2)
		expect(result.taker.sizeRemaining).toBe(150)
		expect(result.taker.status).toBe('partially-filled')
		expect(result.makers.length).toBe(1)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[0].sizeRemaining).toBe(0)
	})

	it('one-to-many partial fill', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.38, 100)
		let order2 = new LimitOrder('ask', 13.38, 200)
		let order3 = new LimitOrder('ask', 13.38, 400)
		let order4 = new LimitOrder('bid', 13.38, 1200)
		orderBook.add(order1)
		orderBook.add(order2)
		orderBook.add(order3)
		const result = orderBook.add(order4)
		expect(result.taker).toEqual(order4)
		expect(result.taker.sizeRemaining).toBe(500)
		expect(result.taker.status).toBe('partially-filled')
		expect(result.makers.length).toBe(3)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[1]).toEqual(order2)
		expect(result.makers[2]).toEqual(order3)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[1].sizeRemaining).toBe(0)
		expect(result.makers[2].sizeRemaining).toBe(0)
	})

	it('should remove maker order when one-to-one complete fill', () => {
		let orderBook = new LimitOrderBook()
		let order1 = new LimitOrder('ask', 13.98, 5)
		let order2 = new LimitOrder('ask', 13.97, 5)
		let order3 = new LimitOrder('bid', 13.98, 5)
		orderBook.add(order1)
		orderBook.add(order2)
		let result = orderBook.add(order3)
		expect(result.taker).toEqual(order3)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(1)
		expect(result.makers[0]).toEqual(order1)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[0].status).toBe('filled')
		expect(orderBook.asks.hasLimitOrders()).toBe(true)
		expect(orderBook.asks.getLowestPrice().headOrder).toEqual(
			order2,
		)
		expect(orderBook.asks.getHighestPrice().headOrder).toEqual(
			order2,
		)
	})

	it('should remove maker orders when one-to-many complete fill', () => {
		let orderBook = new LimitOrderBook()
		let orderA = new LimitOrder('ask', 14.0, 10)
		let orderB = new LimitOrder('ask', 13.9, 10)
		let orderC = new LimitOrder('ask', 13.98, 10)
		let order1 = new LimitOrder('ask', 13.98, 5)
		let order2 = new LimitOrder('ask', 13.97, 5)
		let order3 = new LimitOrder('bid', 13.98, 15)
		orderBook.add(orderA)
		orderBook.add(orderB)
		orderBook.add(orderC)
		orderBook.add(order1)
		orderBook.add(order2)
		let result = orderBook.add(order3)
		expect(result.taker).toEqual(order3)
		expect(result.taker.sizeRemaining).toBe(0)
		expect(result.taker.status).toBe('filled')
		expect(result.makers.length).toBe(2)
		expect(result.makers[0]).toEqual(orderC)
		expect(result.makers[0].sizeRemaining).toBe(0)
		expect(result.makers[0].status).toBe('filled')
		expect(result.makers[1]).toEqual(order1)
		expect(result.makers[1].sizeRemaining).toBe(0)
		expect(result.makers[1].status).toBe('filled')
		expect(orderBook.asks.hasLimitOrders()).toBe(true)
		expect(orderBook.asks.getLowestPrice().headOrder).toEqual(
			orderB,
		)
		expect(orderBook.asks.getHighestPrice().headOrder).toEqual(
			orderA,
		)
	})
})
