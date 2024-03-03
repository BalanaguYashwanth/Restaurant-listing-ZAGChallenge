const listingModel = require('../models/listingModel');
const reviewsModel = require('../models/reviewModel')

const postReviews = async (req, res) => {
    try{
        const {user} = req;
        const {restaurantId} = req.params;
        const {userComment, userRating} = req.body
        const userInfo = {
            ...user,
            userComment,
            userRating
        }
        const reviewsObj = await reviewsModel.findOne({_id: restaurantId})
        if(reviewsObj?.reviews){
            const data = await updateRatingAndReviews({restaurantId, reviewsObj, user, userInfo, userRating});
            res.status(200).json({message: data})
        }else{
            const reviewData = {
                _id: restaurantId,
                averageRating: userRating,
                reviews:[userInfo]
            }
            const response = await reviewsModel.create(reviewData)
            res.status(201).json({message: response})
            await updateAverageRatingInListings(restaurantId, userRating);
        }
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const updateRatingAndReviews = async ({restaurantId, reviewsObj, user, userInfo, userRating}) => {
    const {averageRating, reviews} = reviewsObj
    const hasReviewExists = reviews.find(review => review.id === user.id)
    if(hasReviewExists){
        throw new Error("Review is already exists")
    }else{
        reviews.push(userInfo)
        const overallAvgRating = ((averageRating+userRating)/2).toFixed(1)
        reviewsObj.averageRating = overallAvgRating;
        await reviewsObj.save()
        await updateAverageRatingInListings(restaurantId, overallAvgRating);
        return reviewsObj;
    }
}

const updateAverageRatingInListings = async(restaurantId, averageRating) => {
    await listingModel.updateOne({_id: restaurantId},{$set:{rating: averageRating}})
}

module.exports = {
    postReviews
}