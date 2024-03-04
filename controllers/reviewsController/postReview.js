const { updateAverageRatingInListings, validateUserRating } = require('../../helpers/reviewHelpers');
const listingModel = require('../../models/listingModel');
const reviewsModel = require('../../models/reviewModel')

const postReviews = async (req, res) => {
    try{
        const {user} = req;
        const {restaurantId} = req.params;
        const {userComment, userRating} = req.body
        validateUserRating(userRating)
        const userInfo = {
            ...user,
            userComment,
            userRating
        }
        const reviewsObj = await reviewsModel.findOne({_id: restaurantId})

        //Already have some reviews, add one
        if(reviewsObj?.reviews?.length){
            const data = await updateRatingAndReviews({restaurantId, reviewsObj, user, userInfo, userRating});
            res.status(200).json({message: data})
        }else{
            //create one to restaurant
            const response = await createRatingAndReviews(restaurantId, userRating, userInfo);
            res.status(201).json({message: response})
            
        }
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const createRatingAndReviews = async (restaurantId, userRating, userInfo) => {
    const hasRestaurentExists = await listingModel.findOne({_id: restaurantId})
    if(hasRestaurentExists){
        const response = await reviewsModel.updateOne({_id: restaurantId},{averageRating: userRating, reviews: [userInfo]},{upsert: true});
        await updateAverageRatingInListings(restaurantId, userRating);
        return response;
    }else{
        throw new Error('Restaurant doesnot exists might be removed')
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

module.exports = {
    postReviews
}

