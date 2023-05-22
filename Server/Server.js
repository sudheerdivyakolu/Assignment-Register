require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const express = require('express');
const app = express();
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOrigins');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;
const store = new MongoDBStore(
    {
      uri: process.env.DATABASE_URI,
      databaseName: 'assignment-app',
      collection: 'mySessions'
    });

//connect to mongodb
connectDB();

//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//for form data
app.use(express.urlencoded({ extended: false }));

//for json data
app.use(express.json());

//middleware for session
app.use(session({
    secret:process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: store,
    resave:false,
    saveUninitialized:true
}));

app.use('^/', require('./routes/users'));

app.use('^/assignments', require('./routes/assignments'));

app.all('*', (req, res) => {
    res.status(404).json({ 'message': 'PAGE-NOT-FOUND' });
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json(err.message);
});

mongoose.connection.once('open', () => {
    console.log('mongodb connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});