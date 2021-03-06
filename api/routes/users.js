const express = require('express');
const router = express.Router();
const User = require('../models/users');

/*
    Get a list of users.
    Req Type: GET
    URL: /users
    Req: -
    Res: [
        //TODO
        ...
    ]
*/
router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status('200').json({
                "message": "Get users Sucessfull.",
                "users": docs.map(doc => {
                    return {
                        _id: doc._id,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        full_name: doc.full_name,
                        email: doc.email,
                        zone: doc.zone,
                        plants: doc.plants
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get users Failed.",
                "error": err
            });
        });
});

/*
    Get a user.
    Req Type: GET
    URL: /users/1234
    Req: -
    Res: [
        //TODO
        ...
    ]
*/
router.get('/:userId', (req, res, next) => {
    User.find({'_id': req.params.userId})
        .exec()
        .then(docs => {
            console.log(docs);
            res.status('200').json({
                "message": "Get User Sucessfull.",
                "user": docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Get User Failed.",
                "error": err
            });
        });
});

module.exports = router;
