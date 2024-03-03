const roleAccess = {
        admin:{
            listing:['GET', 'POST', 'PUT', 'DELETE'],
            review: ['GET', 'POST', 'PUT', 'DELETE']
        },
        owner: {
            listing:['GET', 'POST', 'PUT'],
            review: ['GET', 'PUT']
        },
        user:{
            listing:['GET'],
            review: ['GET', 'POST', 'PUT', 'UPDATE']
        },
    }

module.exports = {
    roleAccess
}