import app from '../../app'
import supertest from 'supertest'
import { setupDB } from '../../test-setup'
import { CREATED, OK } from 'http-status-codes'
import Instrument from '../../models/Instrument'
import OrderBookManager from '../../models/OrderBookManager'

const request = supertest(app)

const INSTRUMENTS = {
	INSTRUMENT_1: {
		address: '0x776a9b10c5fe6045F17B4B0da110672C53608aDd',
	},
	INSTRUMENT_2: {
		address: '0x776a9b10c5fe1805317B4B0da110672C53608aDd',
	},
}

setupDB()

beforeEach(() => {
	// we have to return the promise that resolves when the database is initialized
	OrderBookManager.registerNew(INSTRUMENTS.INSTRUMENT_1)
	OrderBookManager.registerNew(INSTRUMENTS.INSTRUMENT_2)
	return initInstrumentDatabase()
})

const initInstrumentDatabase = async () => {
	await Instrument.create(INSTRUMENTS.INSTRUMENT_1)
	await Instrument.create(INSTRUMENTS.INSTRUMENT_2)
}

describe('Instruments endpoint', () => {
	it('should return all the instruments', async done => {
		const response = await request.get('/instruments')
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body).toHaveProperty('instruments')
		expect(body.instruments.length).toBe(2)
		let instrument = body.instruments[0]
		expect(instrument).toHaveProperty('instrument')
		expect(instrument).toHaveProperty('lowestBid')
		expect(instrument).toHaveProperty('highestAsk')
		expect(instrument.instrument).toBe(
			INSTRUMENTS.INSTRUMENT_1.address,
		)
		instrument = body.instruments[1]
		expect(instrument).toHaveProperty('instrument')
		expect(instrument).toHaveProperty('lowestBid')
		expect(instrument).toHaveProperty('highestAsk')
		expect(instrument.instrument).toBe(
			INSTRUMENTS.INSTRUMENT_2.address,
		)
		done()
	})

	it('should return the bids and asks of an instrument', async done => {
		const response = await request.get(
			`/instruments/${INSTRUMENTS.INSTRUMENT_1.address}`,
		)
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body).toHaveProperty('instrument')
		let { instrument } = body.instrument
		expect(instrument).toHaveProperty('address')
		expect(instrument).toHaveProperty('bids')
		expect(instrument).toHaveProperty('asks')
		expect(instrument).toHaveProperty('lowestBid')
		expect(instrument).toHaveProperty('highestAsk')
		expect(instrument.address).toBe(
			INSTRUMENTS.INSTRUMENT_1.address,
		)
		expect(instrument.bids.length).toBe(0)
		expect(instrument.asks.length).toBe(0)
		expect(instrument.lowestBid).toBe(0)
		expect(instrument.highestAsk).toBe(0)
		done()
	})
})
