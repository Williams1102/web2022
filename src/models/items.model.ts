import { Document, model, Schema, Types } from 'mongoose'
import { ModelName } from './models.shared'
import { Categories } from './categories.model'
import ICategoriesModel from './categories.model'

export interface IItems {
  name: string
  description: string
  image: string
  price: number
  category: Types.ObjectId
}

export default interface IItemModel extends Document, IItems {}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
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
      require: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
  },
  {
    timestamps: true,
  },
)

export const Items = model<IItemModel>(ModelName.Item, schema)
