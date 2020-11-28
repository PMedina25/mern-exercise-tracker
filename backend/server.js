const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// dotenv loads environment variables from a .env file into process.env. 
// This makes development simpler. Instead of setting environment variables 
// on our development machine, they can be stored in a file. 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;

// The section useNewUrlParser: true is added because the MongoDB Node.js 
// driver rewrote the tool it uses to parse MongoDB connection strings. 
// Because this is such a big change, they put the new connection string 
// parser behind a flag. The section useCreateIndex: true is similar. 
// It is to deal with MongoDB deprecating the ensureIndex() function.
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established succesfully");
});

// We load the routers from the files
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

// We add the routers as middleware
app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

