import ICategoriesModel, { Categories, ICategory } from '@/models/categories.model'
import { IUserJwt } from '@/models/user.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import { authenticate } from 'passport'
import httpStatus from 'http-status'
import IItemModel, { Items, IItems } from '@/models/items.model'
import { upload, Resize } from '@/utils/multer'
import fs from 'fs'
import { Images } from '@/models/images.model'
import path from 'path'
import root from 'app-root-path'
import z from 'zod'
import { ModelName } from '../models/models.shared'
import { LeanDocument } from 'mongoose'

const router = express.Router()

const InputItemsDTO = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().default(''),
  price: z.number().default(0),
  priceString: z.string(),
  category: z.string(),
})

router.post(
  '/admin/add',
  authenticate(['jwt'], { session: false }),
  upload.single('file'),
  async (req, res, next) => {
    try {
      const body = InputItemsDTO.parse(req.body)
      const user = req?.user as IUserJwt
      if (user.role !== 'Admin')
        return res.status(400).json({
          message: 'Role must be Admin',
        })

      if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' })
      }

      const imagePath = path.join(root.path, 'src/public/images')
      const img = new Resize(imagePath)
      const filename = await img.save(req.file.buffer)
      body.image = '/images/' + filename
      body.price = +body.priceString
      const itemDb = new Items(body)

      await itemDb.save()

      res.json(itemDb)
    } catch (e) {
      next(e)
    }
  },
)

const QueryList = z.object({
  search: z.string().optional(),
})

const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

// router.delete('/', async (req, res, next) => {
//   await Items.deleteMany()
//   res.send('Done')
// })

router.get('/', async (req, res, next) => {
  try {
    const q = QueryList.parse(req.query)
    let listItems: any[]

    if (q?.search) {
      listItems = await Items.find({ name: new RegExp(q.search, 'i') })
        .populate('category', 'name')
        .orFail()
        .lean()

      let itemId
      if (checkForHexRegExp.test(q?.search))
        itemId = await Items.findOne({ _id: q?.search })
          .populate('category', 'name')
          .orFail()
          .lean()

      if (itemId) listItems = [itemId, ...listItems]
    } else listItems = await Items.find().populate('category', 'name').orFail().lean()
    console.log('🚀 ~ file: items.route.ts ~ line 92 ~ router.get ~  listItems ', listItems)

    if (!listItems) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found')

    res.json(listItems.map((o) => ({ ...o, image: o.image })))
  } catch (e) {
    next(e)
  }
})
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    console.log('🚀 ~ file: items.route.ts ~ line 90 ~ router.get ~  id', id)
    const listItems = await Items.findOne({ _id: id }).populate('category', 'name').lean()
    console.log('🚀 ~ file: items.route.ts ~ line 91 ~ router.get ~ listItems', listItems)

    if (!listItems) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found')

    res.json(listItems)
  } catch (e) {
    next(e)
  }
})

export default router
