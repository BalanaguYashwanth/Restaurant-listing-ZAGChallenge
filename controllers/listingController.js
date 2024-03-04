const { roles } = require('../config/roleAccess')
const Auth = require('../models/authModel')
const Listing = require('../models/listingModel')
const Reviews = require('../models/reviewModel')

const checkRestaurantExistsAndAccess = async (id, user) => {
    const restaurant = await Listing.findById(id)
    const {role} = await Auth.findById(user.id)
    if(restaurant){
        if(role != roles.admin){
            if(role === roles.owner && restaurant?.owner?.id != user.id){
                throw new Error('Not allowed to update other restaurants')
            }
        }
    }else{
        throw new Error('Restaurant is not listed in our portal')
    }
}

const getRestaurants = async (req, res) => {
    try{
        const restaurants = await Listing.find({});
        res.status(200).json({message : restaurants})
    }catch(error){
        res.status(400).json({message : error.message})
    }
}

const restaurant = async (req, res) => {
    try{
        const {id} = req.params;
        const restaurant = await Listing.findById(id);
        res.status(200).json({message : restaurant})
    }catch(error){
        res.status(400).json({message : error.message})
    }
}

const createRestaurant = async (req, res) => {
    try{
        const {user} = req;
        const {name, phone, city, address, Images} = req.body
        const hasOwnerExists = await Listing.findOne({"owner.id": user.id})
        if(hasOwnerExists){
            throw new Error('Already your restaurant listed try with different user')
        }
        const listed = await Listing.create({
            owner:user,
            name,
            phone,
            city,
            address,
            Images
        })
        res.status(201).json({message : listed})
    }catch(error){
        res.status(400).json({message : error.message})
    }
   
}

const updateRestaurant = async (req, res) => {
    try{
        //here id is restaurent ID
        const {user} = req;
        const {id} = req.params
        const data = req.body
        if(data?.rating){
            throw new Error('You cant update the rating')
        }
        await checkRestaurantExistsAndAccess(id, user)

        await Listing.updateOne(
            {
                _id: id
            },
            {
                $set:{
                    ...data
                }
            })
        res.status(200).json({message : 'successfully updated'})
    }catch(error){
        res.status(400).json({message : error.message})
    }   
}

const deleteRestaurant = async (req, res) => {
    try{
        //here id is restaurent ID
        const {user} = req;
        const {id} = req.params
        await checkRestaurantExistsAndAccess(id, user)
        await Listing.deleteOne({_id:id})
        await Reviews.deleteOne({_id: id})
        res.status(200).json({'message': 'succesfully deleted'})
    }catch(error){
        res.status(400).json({message : error.message})
    }   
}


module.exports = {
    getRestaurants,
    restaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
}