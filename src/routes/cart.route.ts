import { IUserJwt, User } from '@/models/user.model'
import express from 'express'
import { authenticate } from 'passport'
import z from 'zod'
import { Orders, IOrder } from '../models/orders.model'
import { OrderItems, IOrderItem } from '../models/orderItems.model'
import { Items } from '../models/items.model'
import IUserModel from '../models/user.model'
import logger from '@/config/logger'

const router = express.Router()

const CartInfoDTO = z.object({
  itemId: z.string(),
  quantity: z.number().optional(),
  address: z.string().optional(),
  status: z.enum(['Waiting', 'Cancel', 'Done']).optional(),
  orderId: z.string().optional(),
})

router.post('/', authenticate(['jwt'], { session: false }), async (req, res, next) => {
  const body = CartInfoDTO.parse(req.body)
  logger.info('body')
  const user = req.user as IUserModel
  // NOTE: check if have any carts
  const waitingCart = await Orders.findOne({ status: 'Waiting', userId: user?._id })
  console.log('🚀 ~ file: cart.route.ts ~ line 24 ~ router.post ~  waitingCart', {
    body,
    waitingCart,
  })
  try {
    const ItemDb = await Items.findOne({ _id: body.itemId })

    if (waitingCart) {
      // COMMENT: Update the order's information: including quantity, status,...
      const carts = await OrderItems.find({ orderId: waitingCart._id, itemId: body.itemId })
      const newItemsInCart: IOrderItem = {
        orderId: waitingCart._id,
        quantity: body?.quantity || 1,
        itemId: body.itemId,
      }
      const exist = carts.find((o) => o.itemId.toString() === newItemsInCart.itemId.toString())
      console.log('🚀 ~ file: cart.route.ts ~ line 37 ~ router.post ~ exist', { carts, exist })

      if (body?.status) {
        if (!body.orderId) return next({ message: 'No OrderId' })
        waitingCart.status = body.status
        await waitingCart.save()
        logger.debug('Check')
        return res.status(200).send(waitingCart)
      }

      waitingCart.total += +ItemDb.price
      waitingCart.address = body?.address || waitingCart.address
      await waitingCart.save()

      if (exist) {
        exist.quantity += +newItemsInCart.quantity
        await exist.save()
        return res.status(200).send({ items: exist, order: waitingCart })
      }

      const newDb = await OrderItems.create(newItemsInCart)
      res.status(200).send(newDb)
    } else {
      // COMMENT: Create new the order's information: including quantity, status,...

      const UserBb = await User.findOne({ _id: user?._id })
      console.log('🚀 ~ file: cart.route.ts ~ line 45 ~ router.post ~ UserBb', { UserBb })

      const newCart: IOrder = {
        status: 'Waiting',
        address: body?.address || UserBb.address,
        userId: UserBb._id,
        total: ItemDb.price,
      }

      const newOrder = await Orders.create(newCart)

      const newItemInCart: IOrderItem = {
        orderId: newOrder._id,
        itemId: body.itemId,
        quantity: body?.quantity || 1,
      }

      const newDb = await OrderItems.create(newItemInCart)
      res.status(200).send(newDb)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/', authenticate(['jwt'], { session: false }), async (req, res, next) => {
  try {
    const user = req.user as IUserModel

    const waitingCart = await Orders.findOne({ status: 'Waiting', userId: user?._id })

    const carts = await OrderItems.find({ orderId: waitingCart?._id }).populate('itemId').lean()
    console.log('🚀 ~ file: cart.route.ts ~ line 90 ~ router.get ~ carts', carts)
    res.status(200).json({
      order: waitingCart,
      items: carts.map((o) => ({ info: o.itemId, quantity: o.quantity })),
    })
  } catch (err) {
    next(err)
  }
})

export default router
