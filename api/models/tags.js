const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    tag: {type: String}
});

module.exports = mongoose.model('tag', tagSchema, "tags");
