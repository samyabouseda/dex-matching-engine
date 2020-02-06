import { Router } from 'express'
import { OK } from 'http-status-codes'
import instrumentRoutes from './instrument-routes'

const router = Router()

router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

// ADD ROUTES BELLOW
router.use('/instruments', instrumentRoutes)

export default router
