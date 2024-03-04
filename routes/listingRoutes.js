const express = require('express')
const validateTokenAndAccess = require('../middleware/validateTokenAndAccess')
const { getRestaurants, createRestaurant, restaurant, updateRestaurant, deleteRestaurant } = require('../controllers/listingController')

const router = express.Router()

router.get('/', getRestaurants)
router.get('/:id', restaurant)
router.post('/', validateTokenAndAccess, createRestaurant)
router.put('/:id', validateTokenAndAccess, updateRestaurant)
router.delete('/:id', validateTokenAndAccess, deleteRestaurant)


module.exports = router;