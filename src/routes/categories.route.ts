import { Categories, ICategory } from '@/models/categories.model';
import { IUserJwt } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import express from 'express'
import { authenticate } from 'passport'
import z from 'zod'
import httpStatus from 'http-status';

const router = express.Router()

const AdminVerifyDTO = z.object( {
  apiKey: z.string()
} )

router.post( '/admin/add', authenticate( ['jwt'], { session: false } ), async ( req, res, next ) =>
{
  try
  {

    const user = req?.user as IUserJwt
    if ( user.role !== 'Admin' ) return res.status( 400 ).json( {
      message: 'Role must be Admin'
    } )
    const category = new Categories( req.body )
    await category.save()
    res.json( category )
  } catch ( e )
  {
    next( e )
  }
} )

router.get( '/', async ( req, res, next ) =>
{
  try
  {
    const category = await Categories.find()
    if ( !category ) throw new ApiError( httpStatus.NOT_FOUND, 'Category not found' )
    res.json( category )
  } catch ( e )
  {
    next( e )
  }
} )

export default router
