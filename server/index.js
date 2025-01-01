import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import UserModel from './Models/User.js';
import isAuth from './Middleware/isAuth.js'

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

        req.session.isAuth = true;
        req.session.username = user.username;
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
            req.session.isAuth = true;
            req.session.username = user.username;
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

app.get('/todolist', isAuth, (req, res) => {
    res.redirect('/todolist')
})

app.post('/createTodo/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { task, completed, createdAt } = req.body
      const newTodo = {
        task: task,
        completed: completed,
        createdAt: createdAt,
      }; 
  
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.todos.push(newTodo); 
      await user.save(); 

      const returnedTodo = user.todos.slice(-1)[0]
  
      res.status(201).json(returnedTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/deleteTodo/:userId/:todoId', async (req, res) => {
    try {
      const { userId, todoId } = req.params;
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { todos: { _id: todoId } } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error deleting todo:", error); // Log the error for debugging
      res.status(500).json({ message: 'Error deleting todo: ' + error });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
    });
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});