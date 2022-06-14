import { Schema, Document, model } from 'mongoose'

export interface ICategory
{
  name: string
}

export default interface ICategoriesModel extends Document, ICategory { }

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  },
)

export const Categories = model<ICategoriesModel>( 'Categories', schema )
