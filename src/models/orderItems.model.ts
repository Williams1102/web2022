import { Schema, Document, model } from 'mongoose'
import { number } from 'zod'

export interface IOrderItem
{
  itemId: string
  orderId: string
  quantity: number
}

export default interface IOrderItemModel extends Document, IOrderItem { }

const orderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Orders",

      require: true
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Items",
      require: true
    },
    quantity: {
      type: Number,
      require: true,
      default: 1
    }

  },
  {
    timestamps: true,
  },
)

export const OrderItems = model<IOrderItemModel>( 'OrderItems', orderItemSchema )
