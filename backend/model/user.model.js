import mongoose from 'mongoose';

const UserSchema =  new mongoose.Schema({

    _id :{
        type :mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true
    },
    username:{
        type : String,
        required : true,
        unique :true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String 
    },
    auraPoints:{
        type : Number,
        required: true
    },
    enrolledCourse: {
        type : [mongoose.Schema.Types.ObjectId]
    }
}, {timestamps :true});


const User = mongoose.model('User', UserSchema);
export default User;
