const { roles } = require('../../config/roleAccess');
const authModel = require('../../models/authModel');
const reviewsModel = require('../../models/reviewModel')
const listingModel = require('../../models/listingModel');
const { reCalculateAvgRatings, validateUserRating, updateAverageRatingInListings } = require("../../helpers/reviewHelpers");

const updateReviews = async (req, res) => {
    try{
        const {user} = req;
        const {restaurantId} = req.params;
        const {userComment, userRating, reply} = req.body
        if(userRating){
            validateUserRating(userRating)
        }
        const reviewsObj = await reviewsModel.findOne({_id: restaurantId})
        if(reviewsObj){
            const {reviews} = reviewsObj;
            const hasReviewExists = reviews.find(review => review.id === (reply ? reply.userId : user.id))
            if(hasReviewExists){
                if(reply){
                    await updateRelyForReview(restaurantId, user, reviews, reply);
                }
                if(userComment || userRating){
                    updateCommentAndRatings(restaurantId, reviews, user, userComment, userRating, reviewsObj);
                }
                await reviewsModel.findByIdAndUpdate(restaurantId , {averageRating:reviewsObj.averageRating, reviews});
                res.status(200).json({message: reviewsObj})
            }else{
                throw new Error('Review not found')
            }
        }else{
            throw new Error('Restaurant not found')
        }
    }catch(error){
        res.status(400).json({message: error?.message})
    }
}

const updateCommentAndRatings = async (restaurantId, reviews, user, userComment, userRating, reviewsObj) => {
    reviews.forEach(review => {
        if (review.id === user.id) {
            if (userComment) {
                review.userComment = userComment;
            }
            if (userRating) {
                review.userRating = userRating;
            }
        }
    });

    if (userRating) {
        const averageRating = reCalculateAvgRatings(reviews);
        reviewsObj.averageRating = averageRating
        await updateAverageRatingInListings(restaurantId, averageRating)
    }
}

const updateRelyForReview = async (restaurantId, user, reviews, reply) => {
    const { role } = await authModel.findById(user.id);
    const {_id} = await listingModel.findOne({"owner.id": user?.id}) || {}
    if(_id?.toString() === restaurantId){
        if (role === roles.owner) {
            const index = reviews.findIndex(review => review.id === reply.userId);
            reviews[index].reply = {
                ownerId: user.id,
                ownerName: user.username,
                ownerEmail: user.email,
                ownerComment: reply.comment
            };
        } else {
            throw new Error('Unauthorized access');
        }
    }else{
        throw new Error('You cant reply for other restaurants');
    }
}

module.exports = {
    updateReviews
}


