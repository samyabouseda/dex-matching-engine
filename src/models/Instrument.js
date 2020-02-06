import { Schema, model } from 'mongoose'
import OrderBookManager from './OrderBookManager'

const instrumentSchema = new Schema({
	address: {
		type: String,
		unique: true,
		required: true,
	},
})

// instrumentSchema.statics.getAll = async function() {
// 	return OrderBookManager.getAll()
// }

const Instrument = model('Instrument', instrumentSchema)

export default Instrument
