const express = require('express');
const app = express();
const morgan = require('morgan'); // Logging
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Routes
const Plants = require('./api/routes/plants');
const PlantsCare = require('./api/routes/plants-care');
const Zones = require('./api/routes/zones');
const PlantsCategories = require('./api/routes/plants-categories');
const Users = require('./api/routes/users');
const Helps = require('./api/routes/helps');

// Connect to Mongoose
// mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PWD + '@plant-care-kdwwo.mongodb.net/test?retryWrites=true',
mongoose.connect('mongodb+srv://node-shop:nodeshop@plant-care-kdwwo.mongodb.net/test?retryWrites=true',
{ 'useNewUrlParser': true });
mongoose.Promise = global.Promise;

// Start app for dev. 
app.use(morgan('dev'));

// Parse the HTTP request body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set the response headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Return with the right headers in case this is an OPTIONS req.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
        'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/plants', Plants);
app.use('/plants-care', PlantsCare);
app.use('/zones', Zones);
app.use('/plant-categories', PlantsCategories);
app.use('/users', Users);
app.use('/helps', Helps);

// Handle errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = '404';
    next(error);
});

// Handle errors
app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
