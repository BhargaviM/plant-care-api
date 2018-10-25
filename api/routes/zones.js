const express = require('express');
const router = express.Router();
const Zone = require('../models/zones');

/*
    Get a list of zones.
    Req Type: GET
    URL: /zones
    Req: -
    Res: [
        {zone: ''},
        {zone: ''},
        ...
    ]
*/
router.get('/', (req, res, next) => {
    Zone.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status('200').json({
                "message": "Get zones Sucessfull.",
                "zones": docs.map(doc => {
                    return {
                        value: doc.zone,
                        label: doc.zone
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get zones Failed.",
                "error": err
            });
        });
});

module.exports = router;