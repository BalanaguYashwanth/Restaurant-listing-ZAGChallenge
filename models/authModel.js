const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: [true, 'Username is required'],
    },
    email:{
        lowercase: true,
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email is required"],
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    role:{
        type: String,
        enum: ['owner','user','admin'],
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Auth', authSchema);