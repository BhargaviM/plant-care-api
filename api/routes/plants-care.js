const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Zones = require('../models/zones');
const models = require('../models/plants');
const Plants = models.Plant;
const PlantsCare = models.PlantsCare;

/*
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

// Also Reuse code between this and POST plants
/*
    Retrieve a list of plants care.
    Req Type: POST
    URL: /plants-care
    Req: {
        plants: ["plant._id", "plant._id,..."],
        zone: "2b",
        month: "march" [OPTIONAL]
    }
    Res: [
        //TODO
    ]
*/
router.post('/', (req, res, next) => {
    let selectFields = 'plant care month';
    let filterOptions = {
        'plant': { $in: req.body.plants },
        'zone': req.body.zone
    };

    // Get plant care for given plants and zone, just for the month given
    if ('month' in req.body) {
        filterOptions.month = req.body.month;
        selectFields = 'plant care';
    }
    
    PlantsCare.find(filterOptions)
    .select(selectFields)
    .populate('plant', 'name')
    .exec()
    .then(docs => {
        console.log(docs);
        if (docs && docs.length > 0) {
            let response;
            
            if ('month' in req.body) {
                // response is just for the requested month already
                response = docs;
            } else {
                // Plant care doc -> organized by month
                response = arrayToObject(docs);
            }

            res.status('200').json({
                "message": "Plant Cares Sucessfull.",
                "plantsCare": response
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
});

/*
    Add a plant care
    Req Type: POST
    URL: /plants-care/new
    Req: {
        "plant": "5bc948588e83b73a0d25a771",
        "month": "january",
        "care": "Don't kill Tulip plant in zone 2b in January.",
        "zone": "2b",
        "fertilizer": {
            "text": "Now is the time to fertilize. Use a good 10-10-10 fertilizer. Sprinkle the fertilizer away from the roots, around the leaf drip line and cover with soil according to the package instructions.",
            "link": "https://www.homedepot.com/p/Hyponex-40-lb-All-Purpose-Fertilizer-10-10-10-523902/202968725",
            "link-text": "Suggested fertilizer"
        }
    }
    Res: {
        "message": "Save plant care Sucessfull.",
        "care": {
            "_id": "5bcb13aae3f4174ded7c96e0",
            "plant": ,
            //TODO
        }
    }
 */
router.post('/new', (req, res, next) => {
    console.log('Plant Care POST.');

    // Make sure the Plant exists
    Plants.findById(req.body.plant)
        .exec()
        .then(plant => {
            // Make sure the zone exists
            Zones.findById(req.body.zone);
        })
        .then(zone => {
            console.log('');
            console.log(JSON.stringify(req.body.care));
            console.log('');
            
            // Create a new PlantCare object to save
            let plantCareInfo = {
                plant: req.body.plant,
                month: req.body.month,
                zone: req.body.zone,
                care: req.body.care,
                fertilizer: req.body.fertilizer
            };
            const PlantCare = new PlantsCare({
                _id: mongoose.Types.ObjectId(),
                ...plantCareInfo
            });
            return PlantCare.save();
        })
        .then(result => {
            console.log('Plant care SAVE successful.');

            res.status('200').json({
                "message": "Save plant care Sucessfull.",
                "plant": result
            });
        })
        .catch(err => {
            console.log(`Error: ${err}`);
            res.status(500).json({
                "message": "Save plant care Failed.",
                "error": err
            });
        });
});

module.exports = router;