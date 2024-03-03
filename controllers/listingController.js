const Listing = require('../models/listingModel')

const checkRestaurantExists = async (id) => {
    const restaurant = await Listing.findById(id)
    if(!restaurant){
        throw new Error('Restaurant is not listed in our portal')
    }
}

const getRestaurants = async (req, res) => {
    try{
        const restaurants = await Listing.find({});
        res.status(200).json({message : restaurants})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const restaurant = async (req, res) => {
    try{
        const {id} = req.params;
        const restaurant = await Listing.findById(id);
        res.status(200).json({message : restaurant})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const createRestaurant = async (req, res) => {
    try{
        const {name, phone, city, address, Images} = req.body
        const listed = await Listing.create({
            name,
            phone,
            city,
            address,
            Images
        })
        res.status(201).json({message : listed})
    }catch(error){
        res.status(400).json({message: error.message})
    }
   
}

const updateRestaurant = async (req, res) => {
    try{
        const {id} = req.params
        const data = req.body
        await checkRestaurantExists(id)
        await Listing.updateOne(
            {
                _id: id
            },
            {
                $set:{
                    ...data
                }
            })
        res.status(200).json({message: 'successfully updated'})
    }catch(error){
        res.status(400).json({message: error.message})
    }   
}

const deleteRestaurant = async (req, res) => {
    try{
        const {id} = req.params
        await checkRestaurantExists(id)
        await Listing.deleteOne({_id:id})
        res.status(200).json({'message': 'succesfully deleted'})
    }catch(error){
        res.status(400).json({message: error.message})
    }   
}


module.exports = {
    getRestaurants,
    restaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
}