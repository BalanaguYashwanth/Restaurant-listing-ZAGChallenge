const { default: mongoose } = require("mongoose");

const listingSchema = mongoose.Schema({
    rating : {
        type: Number,
        default: 0,
    },
    name:{
        type: String,
        unique: true,
        required: [true, 'Name is required'],
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    address:{
        type: String,
        required: [true, 'Address is required']
    },
    Images:{
        type : Array , 
        required: [true, 'Images are required']
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Listing', listingSchema);