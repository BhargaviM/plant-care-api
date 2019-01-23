const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Users = require('../models/users');
const models = require('../models/plants');
const Plant = models.Plant;
const PlantsCare = models.PlantsCare;

/*
    TODO reuse same code between here and plants-care.js
    Used partially from 
    https://medium.com/dailyjs/rewriting-javascript-converting-an-array-of-objects-to-an-object-ec579cafbfc7
    */
arrayToObject = (array) =>
    array.reduce((careByMonth, doc) => {
        const month = doc.month;
        if (month in careByMonth) {
            careByMonth[month].push({
                plant: doc.plant.name,
                care: doc.care
            });
        } else {
            careByMonth[month] = [{
                plant: doc.plant.name,
                care: doc.care
            }];
        }
        return careByMonth
    }, {});

/*
    Get a list of plants.
    Req Type: GET
    URL: /plants/{optional tag}
    Req: -
    Res: [
        {_id: '', name: ''},
        {_id: '', name: ''},
        ...
    ]
*/
router.get('/:tag?', (req, res, next) => {
    let findParams = {};
    if (req.params.tag && req.params.tag != undefined) {
        findParams.tags = req.params.tag;
    }
    console.log(`FindParams: `+ JSON.stringify(findParams));
    Plant.find(findParams)
        .select('name  _id')
        .exec()
        .then(docs => {
            if (docs && docs.length > 0) {
                console.log('Plants: '+docs);
                res.status('200').json({
                    "tag": req.params.tag,
                    "message": "Get plants Sucessfull.",
                    "plants": docs
                });
            } else {
                console.log('No Plants found.');
                res.status('200').json({
                    "message": "No plants found.",
                });
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get plants Failed.",
                "error": err
            });
        });
});

/*
    Save user preferences and get the plant care.
    Req Type: POST
    URL: /plants
    Req: {
        plants: ["plant._id", "plant._id,..."],
        custom_plants: "Speical Rose, Black Tulips"
        zone: "2b",
        email: "foo@bar.com",
        first_name: "Bhargavi",
        last_name: "Thaduri",
        full_name: "Bhargavi Thaduri"
    }
    Res: {
        message: "Save plant Sucessfull.",
        plantsCare: {
            january: [
                {plant: "Boxwood", care: ["Don't kill plant Boxwood in zone 1a in april.", "Fertilize it."]}
                {plant: "Hydrangea", ....}
            ],
            febraury: ....
        }
    }
*/
router.post('/', (req, res, next) => {
    // Save the user preferences
    const User = new Users({
        _id: mongoose.Types.ObjectId(),
        plants: req.body.plants,
        custom_plants: req.body.custom_plants,
        zone: req.body.zone,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        full_name: req.body.full_name
    });
    User.save()
        .then(result => {

            // Get the appropriate plant care for the selected plants and zone
            PlantsCare.find({
                'plant': { $in: req.body.plants },
                'zone': req.body.zone
            })
            .select("plant care month")
            .populate('plant', 'name')
            .exec()
            .then(docs => {
                console.log(docs);
                if (docs && docs.length > 0) {
                    // Plant care doc -> organized by month
                    const careByMonth = arrayToObject(docs);

                    // careByMonth[month].push({
                    //     plant: doc.plant.name,
                    //     care: doc['care'][month]
                    // });
                    res.status('200').json({
                        "message": "Save plant Sucessfull.",
                        "plantsCare": careByMonth
                    });
                } else {
                    console.log("No matching plant care");
                    res.status(500).json({
                    "message": "Get plants care Failed.",
                    "error": "No matching plant care."
                });
                }
                
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    "message": "Get plants care Failed.",
                    "error": err
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get plants Failed.",
                "error": err
            });
        });
});

/*
    Add new plant.
    Req Type: POST
    URL: /plants/new-plant
    Req: {
        "name": "Lily of the valey",
        "description": "A shrub.",
        "height": "1 feet",
        "tags": ["perennial", "shrub"]
    }
    Res: {
        "message": "Save plant Sucessfull.",
        "plants": {
            _id: "df3423..",
            "name": "Lily of the valey",
            "description": "A shrub.",
            "height": "1 feet",
            "tags": ["perennial", "shrub"]
        }
    }
 */
router.post('/new-plant', (req, res, next) => {
    let plantInfo = req.body;
    const PlantToSave = new Plant({
        _id: mongoose.Types.ObjectId(),
        ...plantInfo
    });
    PlantToSave.save()
        .then(result => {
            console.log(result);
            res.status('200').json({
                "message": "Save plant Sucessfull.",
                "plants": result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Save plant Failed.",
                "error": err
            });
        });
});

module.exports = router;