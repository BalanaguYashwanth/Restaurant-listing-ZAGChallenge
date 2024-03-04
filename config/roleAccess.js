const roleAccess = {
        admin:{
            listing:['GET', 'POST', 'PUT', 'DELETE'],
            reviews: ['GET', 'POST', 'PUT', 'DELETE']
        },
        owner: {
            listing:['GET', 'POST', 'PUT'],
            reviews: ['GET', 'PUT']
        },
        user:{
            listing:['GET'],
            reviews: ['GET', 'POST', 'PUT', 'DELETE']
        },
    }

const roles = {
    admin: 'admin',
    owner:'owner',
    user: 'user',

}
module.exports = {
    roles,
    roleAccess
}