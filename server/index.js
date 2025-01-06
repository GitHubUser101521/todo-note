import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { AccountRouter, TodoRouter } from './Routes/Routers.js'

const connectionString = 'mongodb://cherrylcallistacheniago:5dY37ScYM0PunWt6@cluster0-shard-00-00.w41yh.mongodb.net:27017,cluster0-shard-00-01.w41yh.mongodb.net:27017,cluster0-shard-00-02.w41yh.mongodb.net:27017/?replicaSet=atlas-133f4s-shard-0&ssl=true&authSource=admin';
const PORT = 3000;
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
    uri: connectionString,
    collection: "sessions",
});

mongoose.connect(connectionString, {
    dbName: 'TodoNote'
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: "secret_key",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
);

// USE ROUTER

app.use(AccountRouter)
app.use(TodoRouter)

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});