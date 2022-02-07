const express = require('express');
const { APP_PORT, DB_URL } = require('./config');
const errorHandler = require('./middlewares/errorHandler');

// Create server
const app = express();

const routes = require('./routes')
const mongoose = require('mongoose');
const path = require('path');

// Database connection
mongoose.connect('mongodb://localhost:27017/rest-api');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('DB connected...');
});

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api', routes);// Routes


app.use(errorHandler);// Golbal middleware

app.listen(APP_PORT, () => console.log(`Listening... on port ${APP_PORT}`));