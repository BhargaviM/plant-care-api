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
    Req: {
        "sedum": {
            "label": "Sedum",
            "plural": "Sedums"
            
        }
    }
    Res: {
        "message": "Plant Categories Save Sucessfull.",
        "categories": {
            {
            "annual": {
                "label": "Annual",
                "plural": "Annuals"
            },
            "perennial": {
                "label": "Pernnial",
                "plural": "Perennials"
            },...
        }
    }
 */
router.post('/', (req, res, next) => {
    // New category to be saved
    const newCategory = req.body;

    // Find the one categories object and update it.
    PlantCategories.findOne()
        .exec()
        .then(docs => {
            // Existing Categories
            let categories = docs.categories;
            // Extend it
            const newCategories = {...categories, ...newCategory};
            // Update it
            docs.categories = newCategories;
            // Save
            docs.save()
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

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get Plant Categories Failed.",
                "error": err
            });
        });
});


module.exports = router;