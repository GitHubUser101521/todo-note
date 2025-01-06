import { Router } from 'express'
import mongoose from 'mongoose';

import { isAuth } from '../Middleware/Middlewares.js'
import { UserModel } from '../Models/Models.js'

const TodosRouter = Router()

TodosRouter.get('/todolist', isAuth, (req, res) => {
    res.redirect('/todolist')
})

TodosRouter.post('/createTodo/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { task, completed, createdAt, desc, category, color } = req.body
      const newTodo = {
        task: task,
        completed: completed,
        createdAt: createdAt,
        desc: desc,
        category: category,
        color: color
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

TodosRouter.delete('/deleteTodo/:userId/:todoId', async (req, res) => {
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

TodosRouter.patch('/editTodo/:userId/:todoId', async (req, res) => {
    try {
      const { userId, todoId } = req.params;
      const { task, completed, desc } = req.body
  
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId }, 
        { 
            $set: { // Specify the updates to make
                'todos.$[todo].task': task,  
                'todos.$[todo].completed': completed,
                'todos.$[todo].desc': desc,  
            },
        },
        { 
            arrayFilters: [{ 'todo._id': new mongoose.Types.ObjectId(todoId) }],
            new: true,       
            runValidators: true 
        }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.error("Error deleting todo:", error); // Log the error for debugging
      res.status(500).json({ message: 'Error deleting todo: ' + error });
    }
});

export default TodosRouter