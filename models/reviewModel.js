const { default: mongoose, Schema } = require("mongoose");

const reviewsSchema = mongoose.Schema({
    _id:{
        type: Schema.Types.ObjectId, 
        ref: 'Listing'
    },
    averageRating: Number,
    reviews:{
        type: Array,
    },
    reply:{
        type: Object,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Reviews', reviewsSchema)