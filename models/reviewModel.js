const { default: mongoose, Schema } = require("mongoose");

const reviewsSchema = mongoose.Schema({
    _id:{
        type: Schema.Types.ObjectId, 
        ref: 'Listing'
    },
    averageRating: {
        type: Number,
        max:5,
    },
    reviews:{
        type: Array,
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Reviews', reviewsSchema)