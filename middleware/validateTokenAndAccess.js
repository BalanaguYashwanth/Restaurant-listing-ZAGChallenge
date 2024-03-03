const jwt = require('jsonwebtoken')
const Auth = require('../models/authModel');
const { ACCESS_TOKEN_SECRET } = require('../constants');
const { roleAccess } = require('../config/roleAccess');

const validateTokenAndAccess = (req, res, next) => {
    try{
        const {baseUrl, method, headers} = req;
        let authHeader = headers.authorization || headers.Authorization;
        if(authHeader && authHeader.startsWith('Bearer')) {
            const [tokenName, token] = authHeader.split(' ');
            jwt.verify(token, ACCESS_TOKEN_SECRET, async (error, decoded) => {
                if (error) {
                  return res.status(401).json({ message: "Un-Authorized Access" });
                }
                const {user} = decoded
                req.user = user;
                const hasAccess = await checkAccess({baseUrl, method, user})
                if(hasAccess){
                    next();
                }else{
                    return res
                    .status(401)
                    .json({ message: "Un-Authorized Access" });
                }
              });
        }else {
            return res
              .status(401)
              .json({ message: "Un-Authorized Access" });
          }
    }catch(error){
        return res.status(401).json({ message: error?.message });
    }
}

const checkAccess = async ({baseUrl, method, user}) => {
    // Future - We can shift to in-memory or redis cache instead of querying everytime to mongo
    const {role} = await Auth.findOne({_id: user.id})
    const [pathSlash, pathName] = baseUrl.split('/')
    const permissionMethodsArray = roleAccess[role][pathName]
    if(permissionMethodsArray?.includes(method)){
        return true
    }else{
       return false
    }
}

module.exports = validateTokenAndAccess