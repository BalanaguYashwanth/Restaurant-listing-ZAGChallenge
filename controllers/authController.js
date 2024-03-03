const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Auth = require('../models/authModel');
const { ACCESS_TOKEN_SECRET } = require('../constants');

const register = async (req, res) => {
  try{
    const {username, email, password, role} = req.body;
    const hasUserDetails = await Auth.findOne({email});
    if(hasUserDetails){
      throw new Error('Email is already exists')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Auth.create({
      username,
      email,
      password: hashPassword,
      role
    })
  
    if(user){
      const {_id, email} = user;
      return res.status(201).json({ _id, email });
    }else{
      throw new Error("something went wrong while creating a user please try again")
    }
  }catch(error){
    return res.status(400).json({
      message: error.message,
    });
  }
 
}

const login = async(req, res) => {
  try{
    const {email, password} = req.body;
    const hasUserDetails = await Auth.findOne({email})
    if(hasUserDetails){
      const {id, username, password:userPassword, role} = hasUserDetails;
      const comparePassword = await bcrypt.compare(password, userPassword);
      if(comparePassword){
        const accessToken = jwt.sign(
          {
            user: {
              id,
              username,
              email,
            },
          },
          ACCESS_TOKEN_SECRET
        );
        return res.status(200).json({ accessToken });
      }else{
        throw new Error('Login details are wrong, please try again')
      }
    }else{
      throw new Error('Your details are not exists, please register')
    }
  }catch(error){
    return res.status(400).json({
      message: error.message,
    });
  }

}

module.exports = {
    register,
    login
}