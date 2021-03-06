const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    height: {type: String},
    width: {type: String},
    zones: {type: Array, index: true},
    plantingInstructions: {type: String},
    bloomTime: {type: String},
    tags: {type: Array, index: true},
    img: {type: String}
});

const plantsCareSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    plant: {type: mongoose.Schema.Types.ObjectId, ref: 'Plant'},
    month: {type: mongoose.Schema.Types.String, required: true},
    zone: {type: mongoose.Schema.Types.String, required: true},
    care: {type: mongoose.Schema.Types.Mixed},
    fertilizer: {type: mongoose.Schema.Types.Mixed}
});

var Plant = mongoose.model('Plant', plantSchema, 'plants');
var PlantsCare =  mongoose.model('PlantsCare', plantsCareSchema, 'plantsCare');

module.exports = {
    Plant: Plant, 
    PlantsCare: PlantsCare
}