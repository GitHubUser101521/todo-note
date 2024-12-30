import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import UserModel from './Models/User.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const connectionString = 'mongodb://cherrylcallistacheniago:5dY37ScYM0PunWt6@cluster0-shard-00-00.w41yh.mongodb.net:27017,cluster0-shard-00-01.w41yh.mongodb.net:27017,cluster0-shard-00-02.w41yh.mongodb.net:27017/?replicaSet=atlas-133f4s-shard-0&ssl=true&authSource=admin';

mongoose.connect(connectionString, {
    dbName: 'TodoNote'
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

app.post('/signup', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }

        const existingUser = await UserModel.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await UserModel.create({
            name,
            password: hashedPassword,
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }

        const user = await UserModel.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

app.post('/createTodo/:id', async (req, res) => {
    try {
        const { id } = req.params
        const todo = req.body

        const updatedTodo = await UserModel.findByIdAndUpdate(
            { _id: id },
            { $push: { todos: todo } },
            { new: true } // Return the updated document
        );

        if (updatedTodo) {
            res.json(updatedTodo)
        } else {
            res.json({ message: 'Oh no! A todo was failed to be created'})
        }
        
    } catch (error) {
        res.json({ message: error})
    }
})