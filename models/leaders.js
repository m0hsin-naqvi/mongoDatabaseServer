var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true      
    }
}, {
    timestamps: true
});

let Leaders = mongoose.model('Leader', leaderSchema)
module.exports = Leaders;
