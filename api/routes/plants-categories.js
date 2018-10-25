const express = require('express');
const router = express.Router();
const PlantCategories = require('../models/plantCategories');

/*
    Get a list of plant categories.
    Req Type: GET
    URL: /plant-categories
    Req: -
    Res: {
        //TODO
    }
*/
router.get('/', (req, res, next) => {
    PlantCategories.find()
        .select('categories')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length == 1) {
                docs = docs[0];
                res.status('200').json({
                    "message": "Get Plant Categories Sucessfull.",
                    "categories": docs.categories
                });
            } else {
                console.log("More than one categories found");
                res.status(500).json({
                    "message": "Get Plant Categories Failed.",
                    "error": "More than one category object found."
                });
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get Plant Categories Failed.",
                "error": err
            });
        });
});

/*
    Add plant categories.
    Req Type: POST
    URL: /plant-categories
    Req: {}
    Res: {
        "message": "Plant Categories Save Sucessfull.",
        "categories": {
            // TODO
        }
    }
 */
router.post('/', (req, res, next) => {
    const categories = {
        'annual': {label: 'Annual', plural: 'Annuals'},
        'perennial': {label: 'Pernnial', plural: 'Perennials'},
        'herb': {label: 'Herb', plural: 'Herbs'},
        'bulb': {label: 'Bulb', plural: 'Bulbs'},
        'succulent': {label: 'Succulent', plural: 'Succulents'},
        'vine': {label: 'Vine', plural: 'Vines'},
        'fern': {label: 'Fern', plural: 'Ferns'},
        'grass': {label: 'Grass', plural: 'Grasses'},
        'fruit': {label: 'Fruit', plural: 'Fruits'},
        'rose': {label: 'Rose', plural: 'Roses'},
        'shrub': {label: 'Shrub', plural: 'Shrubs'},
        'tree': {label: 'Trees', plural: 'Trees'},
        'vegetable': {label: 'Vegetable', plural: 'Vegetables'}
    }

    const PlantCategoriesObj = new PlantCategories({'categories': categories});
    PlantCategoriesObj.save()
        .then(result => {
            console.log(result);
            res.status('200').json({
                "message": "Save plant categories sucessfull.",
                "categories": result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Save plant categories Failed.",
                "error": err
            });
        });
});


module.exports = router;