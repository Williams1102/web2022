import { Schema, Document, model } from 'mongoose'
import { number } from 'zod'
import { ModelName } from './models.shared'

export interface IOrder {
  status: 'Waiting' | 'Cancel' | 'Done'
  address: string
  userId: string
  total: number
}

export default interface IOrderModel extends Document, IOrder {}

const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Waiting', 'Cancel', 'Done'],
      default: 'Waiting',
    },
    address: {
      type: String,
      required: true,
      maxlength: 500,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    total: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export const Orders = model<IOrderModel>(ModelName.Order, orderSchema)
