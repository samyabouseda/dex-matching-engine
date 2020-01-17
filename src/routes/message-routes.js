import { Router } from 'express'
import { MessageController } from '../controllers'

const routes = Router()

routes.post('/', MessageController.create)
routes.get('/', MessageController.getAll)
routes.get('/:userId', MessageController.getById)
routes.put('/:userId', MessageController.update)
routes.delete('/:userId', MessageController.remove)

export default routes
