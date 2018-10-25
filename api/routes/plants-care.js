const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Zones = require('../models/zones');
const models = require('../models/plants');
const Plants = models.Plant;
const PlantsCare = models.PlantsCare;

// TODO TEST THIS and then update the send-email.perl
// Also reuse code between this and POST plants
/*
    Retrieve a list of plants care.
    Req Type: POST
    URL: /plants-care
    Req: {
        plants: ["plant._id", "plant._id,..."],
        zone: "2b",
    }
    Res: [
        //TODO
    ]
*/
router.post('/', (req, res, next) => {
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
                "message": "Plant Cares Sucessfull.",
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
});

/*
    Add a plant care
    Req Type: POST
    URL: /plants-care/new
    Req: {
          'plant': '5bc948588e83b73a0d25a771',
          'care': {
                      'April': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in April.',
                      'October': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in October.',
                      'May': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in May.',
                      'February': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in February.',
                      'November': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in November.',
                      'June': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in June.',
                      'September': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in September.',
                      'August': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in August.',
                      'March': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in March.',
                      'December': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in December.',
                      'July': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in July.',
                      'January': 'Don\'t kill plant 5bc948588e83b73a0d25a771 in zone 2b in January.'
                    },
          'zone': '2b'
        }
    Res: {
        "message": "Save plant care Sucessfull.",
        "plants": {
            "_id": "5bcb13aae3f4174ded7c96e0",
            "plant": {_id: "", name: "", ...},
            "care": ....,
            'zone': '2b'
            "__v": 0
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
            // Create a new PlantCare object to save
            let plantCareInfo = req.body;
            const PlantCare = new PlantsCare({
                _id: mongoose.Types.ObjectId(),
                ...plantCareInfo
            });
            return PlantCare.save()
        })
        .then(result => {
            console.log('Plant care SAVE successful.');

            res.status('200').json({
                "message": "Save plant care Sucessfull.",
                "plants": result
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