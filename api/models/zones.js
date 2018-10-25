const mongoose = require('mongoose');

const zonesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    zone: {type: String}
});

module.exports = mongoose.model('Zones', zonesSchema, "zones");
