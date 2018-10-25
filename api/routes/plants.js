const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Users = require('../models/users');
const models = require('../models/plants');
const Plant = models.Plant;
const PlantsCare = models.PlantsCare;
// const PlantsCare = require('../models/plants-care');

/*
    Get a list of plants.
    Req Type: GET
    URL: /plants
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
                console.log('No Plants marching the tag.');
                res.status('200').json({
                    "message": "No plants matching the requested tag.",
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
        zone: "2b",
        email: "foo@bar.com"
    }
    Res: [
        {_id: '', name: ''},
        {_id: '', name: ''},
        ...
    ]
*/
router.post('/', (req, res, next) => {
    // Save the user preferences
    const User = new Users({
        _id: mongoose.Types.ObjectId(),
        plants: req.body.plants,
        zone: req.body.zone,
        email: req.body.email
    });
    User.save()
        .then(result => {

            // Get the appropriate plant care for the selected plants and zone
            PlantsCare.find({
                'plant': { $in: req.body.plants },
                'zone': req.body.zone
            })
            .select("plant care")
            .populate('plant', 'name')
            .exec()
            .then(docs => {
                console.log(docs);
                if (docs && docs.length > 0) {
                    // Get a list of months jan-dec from the first plant care doc
                    let months = Object.keys(docs[0].care);
                    
                    // Initialize plant care by month obj
                    let careByMonth = {};
                    months.forEach(month => {
                        careByMonth[month] = [];
                    })

                    // Re save plant care by month, instead of by plant
                    docs.forEach(doc => {
                        months.forEach(month => {
                            careByMonth[month].push({
                                plant: doc.plant.name,
                                care: doc['care'][month]
                            });
                        })
                    });

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