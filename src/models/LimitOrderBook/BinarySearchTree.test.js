import { LimitOrder } from './index'
import BinarySearchTree from './BinarySearchTree'

describe('BinarySearchTree', () => {
	let order1 = new LimitOrder('bid', 13.38, 5)
	let order2 = new LimitOrder('bid', 13.41, 5)
	let order3 = new LimitOrder('bid', 13.34, 5)
	let order4 = new LimitOrder('bid', 13.43, 5)
	let order5 = new LimitOrder('bid', 13.39, 5)
	let order6 = new LimitOrder('bid', 13.36, 5)
	let bst = null

	beforeEach(() => {
		bst = new BinarySearchTree()
		bst.add(order1)
		bst.add(order2)
		bst.add(order3)
		bst.add(order4)
		bst.add(order5)
		bst.add(order6)
	})

	it('should return the lowest price limit', () => {
		expect(bst.getLowestPrice().limitPrice).toBe(13.34)
	})

	it('should return the highest price limit', () => {
		expect(bst.getHighestPrice().limitPrice).toBe(13.43)
	})

	it('should remove node without children', () => {
		bst.remove(order4)
		expect(bst.getLowestPrice().limitPrice).toBe(13.34)
		expect(bst.getHighestPrice().limitPrice).toBe(13.41)
	})

	it('should remove node with one children', () => {
		bst.remove(order3)
		expect(bst.getLowestPrice().limitPrice).toBe(13.36)
		expect(bst.getHighestPrice().limitPrice).toBe(13.43)
	})

	it('should remove node with two children', () => {
		bst.remove(order2)
		expect(bst.root.rightChild.limitPrice).toBe(13.43)
		expect(bst.root.rightChild.leftChild.limitPrice).toBe(13.39)
	})

	it('should remove node with one children in complex tree', () => {
		let order7 = new LimitOrder('bid', 13.1, 5)
		let order8 = new LimitOrder('bid', 13.2, 5)
		let order9 = new LimitOrder('bid', 13.15, 5)
		let order10 = new LimitOrder('bid', 13.22, 5)
		let order11 = new LimitOrder('bid', 13.21, 5)
		let order12 = new LimitOrder('bid', 13.23, 5)
		let order13 = new LimitOrder('bid', 13.14, 5)
		let order14 = new LimitOrder('bid', 13.13, 5)
		let order15 = new LimitOrder('bid', 13.51, 5)
		bst.add(order7)
		bst.add(order8)
		bst.add(order9)
		bst.add(order10)
		bst.add(order11)
		bst.add(order12)
		bst.add(order13)
		bst.add(order14)
		bst.add(order15)

		expect(bst.getLowestPrice().limitPrice).toBe(13.1)
		expect(bst.getHighestPrice().limitPrice).toBe(13.51)

		bst.remove(order7)

		expect(bst.getLowestPrice().limitPrice).toBe(13.13)
		expect(bst.getHighestPrice().limitPrice).toBe(13.51)
	})

	it('should remove one order out of many for a limit price', () => {
		let order7 = new LimitOrder('bid', 13.41, 7)
		let order8 = new LimitOrder('bid', 13.41, 2)
		let order9 = new LimitOrder('bid', 13.41, 8)
		let order10 = new LimitOrder('bid', 13.41, 4)
		bst.add(order7)
		bst.add(order8)
		bst.add(order9)
		bst.add(order10)
		expect(bst.root.rightChild.headOrder).toBe(order2)
		bst.remove(order2)
		expect(bst.root.rightChild.headOrder).toBe(order7)
	})
})
