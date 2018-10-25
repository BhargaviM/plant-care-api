const mongoose = require('mongoose');

const plantCategoriesSchema = mongoose.Schema({
    categories: {type: mongoose.Schema.Types.Mixed}
});

module.exports = mongoose.model('plantCategories', 
                    plantCategoriesSchema, "plantCategories");
