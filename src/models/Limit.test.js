import LimitNode from './LimitNode'

// class BinarySearchTree {
// 	constructor(root = null) {
// 		this.root = root
// 		this.isEmpty = this.isEmpty.bind(this)
// 		this.add = this.add.bind(this)
// 		this.search = this.search.bind(this)
// 		this.remove = this.remove.bind(this)
// 	}
//
// 	isEmpty() {
// 		return this.root === null
// 	}
//
// 	add(value) {
// 		if (this.isEmpty()) {
// 			this.root = new BSTNode(value)
// 			return true
// 		} else {
// 			return this.root.add(value)
// 		}
// 	}
//
// 	search(value) {
// 		if (this.isEmpty()) {
// 			return false
// 		} else {
// 			this.root.search(value)
// 		}
// 	}
//
// 	remove(value) {
// 		if (this.isEmpty()) {
// 			return false
// 		} else {
// 			if (this.root.value === value) {
//
// 			}
// 		}
// 	}
// }

class BSTNode {
	constructor(value) {
		this.value = value
		this.leftChild = null
		this.rightChild = null
		this.add = this.add.bind(this)
		this.search = this.search.bind(this)
	}

	add(value) {
		if (value === this.value) {
			// insert in doubly linked list
			return true
		} else if (value < this.value) {
				if (this.leftChild === null) {
					this.leftChild = new BSTNode(value)
					return true
				} else {
					return this.leftChild.add(value)
				}
		} else if (value > this.value) {
				if (this.rightChild === null) {
					this.rightChild = new BSTNode(value)
					return true
				} else {
					return this.rightChild.add(value)
				}
		} else {
			return false
		}
	}

	search(value) {
		if (value === this.value) {
			return true
		} else if (value < this.value) {
			if (this.leftChild === null) {
				return false
			} else {
				return this.leftChild.search(value)
			}
		} else if (value > this.value) {
			if (this.rightChild === null) {
				return false
			} else {
				return this.rightChild.search(value)
			}
		} else {
			return false
		}
	}

}

it('should remove', () => {

})