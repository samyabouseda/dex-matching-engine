import { Router } from 'express'
import { OK } from 'http-status-codes'

const router = Router()

router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

export default router
