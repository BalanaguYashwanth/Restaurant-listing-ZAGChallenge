const express = require('express')
const validateToken = require('../middleware/validateToken')
const { getRestaurants, createRestaurant, restaurant, updateRestaurant, deleteRestaurant } = require('../controllers/listingController')

const router = express.Router()

router.get('/', validateToken, getRestaurants)
router.get('/:id', validateToken, restaurant)
router.post('/', validateToken, createRestaurant)
router.put('/:id', validateToken, updateRestaurant)
router.delete('/:id', validateToken, deleteRestaurant)


module.exports = router;