const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Help = require('../models/helps');

/*
    Add new Help Request.
    Req Type: POST
    URL: /helps/new
    Req: {
        
    }
    Res: {
        "message": "Save Help Message Sucessfull.",
    }
 */
router.post('/new', (req, res, next) => {
    let helpInfo = req.body;
    const HelpToSave = new Help({
        _id: mongoose.Types.ObjectId(),
        ...helpInfo
    });
    HelpToSave.save()
        .then(result => {
            console.log(result);
            res.status('200').json({
                "message": "Save Help Message Sucessfull.",
                "help": result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "Save Help Message Failed.",
                "error": err
            });
        });
});

module.exports = router;