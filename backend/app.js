const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
require('dotenv/config');

app.use(cors());
app.options('*',cors());

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const api = process.env.API_URL;
const employeeRoute = require('./routes/employee');
const cafeRoute = require('./routes/cafe');

// Routes
app.use(`${api}/employee`, employeeRoute);
app.use(`${api}/cafe`, cafeRoute);

const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.listen(3001, () => {
    console.log("Server is listening on port 3000");
});