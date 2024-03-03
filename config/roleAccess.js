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
            reviews: ['GET', 'POST', 'PUT', 'UPDATE']
        },
    }

module.exports = {
    roleAccess
}