const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: {type: String},
    last_name: {type: String},
    full_name: {type: String},
    email: {type: String},
    zone: {type: String},
    plants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Plant'}],
    custom_plants: {type: String},
    unsubscribe: {type: Boolean}
});

module.exports = mongoose.model('Users', usersSchema, "users");
