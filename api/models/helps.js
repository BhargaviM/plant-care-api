const mongoose = require('mongoose');

const helpsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: {type: String},
    last_name: {type: String},
    full_name: {type: String},
    email: {type: String},
    message: {type: String}
});

module.exports = mongoose.model('Helps', helpsSchema, "helps");
