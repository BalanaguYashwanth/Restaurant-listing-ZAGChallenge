const listingModel = require('../models/listingModel');

const reCalculateAvgRatings = (reviews) => {
    let totalRating = 0;
    if(reviews?.length){
        reviews.forEach(review => {
            totalRating += review.userRating;
        });
        const averageRating = totalRating / reviews.length;
        return averageRating.toFixed(1)
    }else{
        return 0
    }

}

const validateUserRating = (rating) => {
    if(!(rating>=1 && rating<=5)){
        throw new Error('Rating is should between from 1 to 5')
    }
}

const updateAverageRatingInListings = async(restaurantId, averageRating) => {
    await listingModel.updateOne({_id: restaurantId},{$set:{rating: averageRating}})
}

module.exports = {
    reCalculateAvgRatings,
    validateUserRating,
    updateAverageRatingInListings
}