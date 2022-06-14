import { Categories, ICategory } from '@/models/categories.model';
import { IUserJwt } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import express from 'express'
import { authenticate } from 'passport'
import z from 'zod'
import httpStatus from 'http-status';
import { Items } from '@/models/items.model';
import { upload, Resize } from '@/utils/multer';
import fs from 'fs'
import { Images } from '@/models/images.model';
import path from 'path';
import root from 'app-root-path';
import zod from 'zod';

const router = express.Router()

const InputItemsDTO = zod.object( {
  name: zod.string(),
  description: zod.string(),
  image: zod.string().default( '' ),
  price: zod.number().default( 0 ),
  priceString: zod.string()
} )

router.post( '/admin/add', authenticate( ['jwt'], { session: false } ), upload.single( 'file' ), async ( req, res, next ) =>
{
  try
  {
    const body = InputItemsDTO.parse( req.body )
    console.log( "🚀 ~ file: items.route.ts ~ line 30 ~ body", body )
    const user = req?.user as IUserJwt
    if ( user.role !== 'Admin' ) return res.status( 400 ).json( {
      message: 'Role must be Admin'
    } )

    if ( !req.file )
    {
      res.status( 401 ).json( { error: 'Please provide an image' } );
    }

    const imagePath = path.join( root.path, 'src/public/images' );
    const img = new Resize( imagePath );
    const filename = await img.save( req.file.buffer );
    body.image = filename
    body.price = +body.priceString
    const itemDb = new Items( body )

    await itemDb.save()

    res.json( itemDb )
  } catch ( e )
  {
    next( e )
  }
} )

router.get( '/', async ( req, res, next ) =>
{
  try
  {
    const listItems = await Items.find()
    if ( !listItems ) throw new ApiError( httpStatus.NOT_FOUND, 'Item not found' )
    res.json( listItems )
  } catch ( e )
  {
    next( e )
  }
} )

export default router
