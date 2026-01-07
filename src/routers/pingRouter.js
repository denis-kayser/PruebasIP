import { Router } from 'express'
import { getPingController, getpublicController } from '../controllers/pingController.js'


const router = Router()

// http://localhost:3000/api/v1/ping
router
  .get('/ping', getPingController)

router
  .get('/ping', getpublicController)

export default router
