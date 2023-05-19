const mongoose = require('mongoose');
const config = require('../common/config');

let dbURI = config.MONGODB_URI;
if (!dbURI) dbURI = 'mongodb://localhost:27017/HighTracks'
console.log(config.MONGODB_URI);
mongoose.connect(dbURI, { useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

if (process.env.NODE_ENV === 'test') {
    mongoose.connection.close(function () {
        console.log('Mongoose connection disconnected');
    });
}

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./tracks');