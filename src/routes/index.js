import { Router } from 'express'
import { OK } from 'http-status-codes'
import instrumentRoutes from './instrument-routes'
import orderRoutes from './order-routes'

const router = Router()

router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

// ADD ROUTES BELLOW
router.use('/instruments', instrumentRoutes)
router.use('/orders', orderRoutes)

export default router
