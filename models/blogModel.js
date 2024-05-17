const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    numView:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01IODKDd-XpRnvBbSDlcg6scby3AOYc2ZfA&s"
    },
    author: {
        type: String,
        deafult: "Admin"
    },

}, {
    toJSON: {
        virtuals: true,
    }, 
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);