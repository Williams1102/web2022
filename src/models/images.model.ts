import { Schema, Document, model } from 'mongoose'
import { v4 } from 'uuid'
export interface IImages
{
  name: string

}

export default interface IImagesModel extends Document, IImages { }

const schema = new Schema(
  {
    name: {
      type: String,
      default: v4()
    },
    file: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  },
)

export const Images = model<IImagesModel>( 'Images', schema )
