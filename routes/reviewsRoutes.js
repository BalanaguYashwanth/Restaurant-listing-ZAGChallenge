const express = require('express')
const validateTokenAndAccess = require('../middleware/validateTokenAndAccess')
const { postReviews } = require('../controllers/reviewsController/postReview')
const { getReviews } = require('../controllers/reviewsController/getReviews')
const { updateReviews } = require('../controllers/reviewsController/updateReview')
const { deleteReview } = require('../controllers/reviewsController/deleteReview')

const router = express.Router()

router.get('/:restaurantId', getReviews)
router.post('/:restaurantId', validateTokenAndAccess, postReviews)
router.put('/:restaurantId', validateTokenAndAccess, updateReviews)
router.delete('/:restaurantId', validateTokenAndAccess, deleteReview)

module.exports = router