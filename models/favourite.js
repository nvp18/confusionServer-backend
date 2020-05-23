const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }]
},{
    timestamps:true
});

const Favourites = mongoose.model('Favourite',favouriteSchema);

module.exports = Favourites;