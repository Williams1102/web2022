import { Schema, Document, model } from 'mongoose'
import { number } from 'zod'

export interface IOrder
{
  code: string
  address: string
  userId: string
  total: number
}

export default interface IOrderModel extends Document, IOrder { }

const orderSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      minlength: 3,
    },
    address: {
      type: String,
      required: true,
      maxlength: 500,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total: {
      type: Number,
      require: true,
      default: 0
    },

  },
  {
    timestamps: true,
  },
)

export const Orders = model<IOrderModel>( 'Orders', orderSchema )
