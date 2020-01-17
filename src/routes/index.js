import { Router } from 'express'
import { OK } from 'http-status-codes'
import userRoutes from './user-routes'
import messageRoutes from './message-routes'
const router = Router()

router.use('/users', userRoutes)
router.use('/messages', messageRoutes)

router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

export default router
