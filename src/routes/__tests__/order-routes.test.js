import app from '../../app'
import supertest from 'supertest'
import { setupDB } from '../../test-setup'
import { CREATED, OK } from 'http-status-codes'
import Instrument from '../../models/Instrument'
import OrderBookManager from '../../models/OrderBookManager'

const request = supertest(app)

const INSTRUMENTS = {
	INSTRUMENT_1: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
	},
	INSTRUMENT_2: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
	},
	INSTRUMENT_3: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
	},
}

const ORDER = {
	ORDER_1: {
		id: '5ed24d9406cadc094a5951d7',
		account: '0x3d088960898540017ABeCEcAf6017246899495e4',
		side: 'bid',
		instrument: INSTRUMENTS.INSTRUMENT_1.address,
		limitPrice: 12.35,
		size: 100,
		status: 'pending',
		entryTime: '2020-05-30T12:12:04.652Z',
	},
	ORDER_2: {
		id: '5ed24d9406cadc094a5951d7',
		account: '0x3d088960898540017ABeCEcAf6017246899495e4',
		side: 'ask',
		instrument: INSTRUMENTS.INSTRUMENT_1.address,
		limitPrice: 12.35,
		size: 100,
		status: 'pending',
		entryTime: '2020-05-30T12:12:04.652Z',
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

describe('Order endpoint', () => {
	it('should place a new order', async done => {
		const response = await request
			.post('/orders/')
			.send({ order: ORDER.ORDER_1 })
		const { status, body } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('order')
		expect(body.order).toHaveProperty('status')
		expect(body.order).toHaveProperty('side')
		expect(body.order).toHaveProperty('size')
		expect(body.order).toHaveProperty('sizeRemaining')
		expect(body.order).toHaveProperty('limitPrice')
		expect(body.order).toHaveProperty('id')
		expect(body.order).toHaveProperty('entryTime')
		done()
	})

	it('should place a second matching order', async done => {
		await request.post('/orders/').send({ order: ORDER.ORDER_1 })
		const response = await request
			.post('/orders/')
			.send({ order: ORDER.ORDER_2 })
		const { status, body } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('order')
		expect(body.order).toHaveProperty('status')
		expect(body.order).toHaveProperty('side')
		expect(body.order).toHaveProperty('size')
		expect(body.order).toHaveProperty('sizeRemaining')
		expect(body.order).toHaveProperty('limitPrice')
		expect(body.order).toHaveProperty('id')
		expect(body.order).toHaveProperty('entryTime')
		done()
	})
})
