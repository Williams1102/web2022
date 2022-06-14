import { Schema, Document, model } from 'mongoose'

export interface IItems
{
  name: string
  description: string
  image: string
  price: number
}

export default interface IItemModel extends Document, IItems { }

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      require: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      require: true
    }
  },
  {
    timestamps: true,
  },
)

export const Items = model<IItemModel>( 'Items', schema )
