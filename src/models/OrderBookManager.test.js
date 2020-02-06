import OrderBookManager from './OrderBookManager'

const INSTRUMENTS = {
	INSTRUMENT_1: {
		address: '0x776a9b10c5fe6045F17B4B0da110672C53608aDd',
	},
	INSTRUMENT_2: {
		address: '0x776a9b10c5fe1805317B4B0da110672C53608aDd',
	},
}

beforeEach(() => {
	OrderBookManager.registerNew(INSTRUMENTS.INSTRUMENT_1)
})

describe('OrderBookManager', () => {
	it('should register a new instrument', () => {
		OrderBookManager.registerNew(INSTRUMENTS.INSTRUMENT_2)
		expect(OrderBookManager.has(INSTRUMENTS.INSTRUMENT_2)).toBe(
			true,
		)
	})

	it('should return a specific instrument', () => {
		const instrument = OrderBookManager.getInstrument(
			INSTRUMENTS.INSTRUMENT_1.address,
		)
		console.log(instrument)
		expect(instrument).toHaveProperty('instrument')
		expect(instrument.instrument).toHaveProperty('address')
		expect(instrument.instrument).toHaveProperty('bids')
		expect(instrument.instrument).toHaveProperty('asks')
		expect(instrument.instrument).toHaveProperty('lowestBid')
		expect(instrument.instrument).toHaveProperty('highestAsk')
		expect(instrument.instrument.address).toBe(
			INSTRUMENTS.INSTRUMENT_1.address,
		)
	})
})
