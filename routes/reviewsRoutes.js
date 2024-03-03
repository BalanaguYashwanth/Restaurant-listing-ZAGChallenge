const express = require('express')
const { postReviews } = require('../controllers/reviewsController')
const validateTokenAndAccess = require('../middleware/validateTokenAndAccess')

const router = express.Router()

// router.get('/:restaurantId', getReviews)
router.post('/:restaurantId', validateTokenAndAccess, postReviews)
// router.put('/:restaurantId', updateReview)
// router.delete('/:restaurantId', deleteReview)

module.exports = router