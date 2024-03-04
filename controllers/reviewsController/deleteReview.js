const { reCalculateAvgRatings, updateAverageRatingInListings } = require('../../helpers/reviewHelpers');
const reviewsModel = require('../../models/reviewModel')

const deleteReview = async (req, res) => {
    try{
        const {userId, reply} = req.body;
        const {restaurantId} = req.params;
        if(userId || reply){
            const reviewsObj = await reviewsModel.findOne({_id: restaurantId})
            if(reviewsObj){
                const {reviews} = reviewsObj;
                if(reply?.userId){
                    await deleteReply(reply, reviews)
                    await reviewsModel.findByIdAndUpdate(restaurantId, {reviews: reviews})
                    res.status(200).json({message: reviewsObj})
                    return;
                }
                const filteredReviews = reviews.filter(review => review.id != userId)
                reviewsObj.reviews = filteredReviews;
                const averageRating = reCalculateAvgRatings(filteredReviews)
                reviewsObj.averageRating = averageRating
                await updateAverageRatingInListings(restaurantId, averageRating)
                await reviewsModel.findByIdAndUpdate(restaurantId, {averageRating, reviews: reviewsObj.reviews})
                res.status(200).json({message: reviewsObj})
            }else{
                throw new Error('Restaurant doesnot exists might be removed')
            }
        }else{
            throw new Error('Please send valid inputs')
        }
    }catch(error){
        res.status(400).json({error: error.message})
    }
}
const deleteReply = async (reply, reviews) => {
    const {userId, ownerId} = reply;
    reviews.forEach(review => {
        if(review.id === userId){
            if(review?.reply?.ownerId == ownerId){
                delete review.reply
                return;
            }
        }
   });
}

module.exports = {
    deleteReview
}