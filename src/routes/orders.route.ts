import { Categories, ICategory } from '@/models/categories.model'
import { IUserJwt } from '@/models/user.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import { authenticate } from 'passport'
import z from 'zod'
import httpStatus from 'http-status'

const router = express.Router()

const AdminVerifyDTO = z.object({
  apiKey: z.string(),
})

router.post('/add-item', authenticate(['jwt'], { session: false }), async (req, res, next) => {
  try {
    const user = req?.user as IUserJwt
  } catch (e) {
    next(e)
  }
})

router.get('/', async (req, res, next) => {
  try {
  } catch (e) {
    next(e)
  }
})

export default router
