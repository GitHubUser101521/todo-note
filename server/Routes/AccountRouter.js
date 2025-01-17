import { Router } from 'express'
import bcrypt from 'bcryptjs';

import UserModel from '../Models/User.js';

const AccountRouter = Router()

AccountRouter.post('/signup', async (req, res) => {
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

AccountRouter.post('/login', async (req, res) => {
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

AccountRouter.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Logout failed.' }); // Send JSON error
      }
      return res.status(200).json({message: "Logged out successfully"}) // Send JSON success message
    });
});

// OTHERS

AccountRouter.post('/addCategory/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { categoryName } = req.body
  
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.categories.push(categoryName); 
      await user.save();
  
      return res.status(201).json({ message: 'Successfully added new category' });
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
})

AccountRouter.delete('/deleteCategory/:userId/:categoryToDel', async (req, res) => {
    try {
        const { userId, categoryToDel } = req.params;
  
        const user = await UserModel.findById(userId);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        const updatedCategories = user.categories.filter(cat => cat !== categoryToDel);
  
        user.categories = updatedCategories;
        await user.save();
  
        return res.status(200).json({ message: 'Category deleted successfully' }); // Changed to 200 OK
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default AccountRouter