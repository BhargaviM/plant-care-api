const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String},
    zone: {type: String},
    plants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Plant'}],
    unsubscribe: {type: Boolean}
});

module.exports = mongoose.model('Users', usersSchema, "users");
