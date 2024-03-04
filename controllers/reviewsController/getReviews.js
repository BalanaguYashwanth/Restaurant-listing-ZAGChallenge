const reviewsModel = require('../../models/reviewModel')

const getReviews = async (req, res) => {
    try{
        const {restaurantId} = req.params;
        const reviewsObj = await reviewsModel.findOne({_id: restaurantId})
        res.status(200).json({message:reviewsObj})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getReviews
}