import express from 'express'

import stores from './stores.route'
import auth from './auth.route'
import category from './categories.route'
import item from './items.route'

const router = express.Router()

router.use( '/stores', stores )
router.use( auth )
router.use( '/category', category )
router.use( '/item', item )

export default router
