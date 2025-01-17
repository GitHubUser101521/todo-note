import { Router } from 'express'
import { UserModel } from '../Models/Models.js'
import mongoose from 'mongoose'

import { isAuth } from '../Middleware/Middlewares.js'

const NoteRouter = Router()

NoteRouter.get('/notes', isAuth, (req, res) => {
    res.redirect('/notes')
})

NoteRouter.post('/createNote/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const { title, createdAt, content, category, color } = req.body
        const newNote = {
            title: title,
            createdAt: createdAt,
            content: content,
            category: category,
            color: color
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notes.push(newNote); 
        await user.save(); 

        const returnedNote = user.notes.slice(-1)[0]
    
        res.status(201).json(returnedNote);
    } catch (error) {
        console.log(error)
    }
})

NoteRouter.get('/getNote/:userId/:noteId', async (req, res) => {
    try {
        const { userId, noteId } = req.params
    
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fetchedNote = user.notes.id(noteId);

        if (fetchedNote) {
            return res.status(200).json(fetchedNote);
        } else {
            return res.status(404).json({ message: 'Note not found' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})

NoteRouter.patch('/editNote/:userId/:noteId', async (req, res) => {
    try {
        const { userId, noteId } = req.params
        const { title, content, color, category } = req.body
    
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { 
                $set: { // Specify the updates to make
                    'notes.$[note].title': title,  
                    'notes.$[note].content': content,
                    'notes.$[note].color': title,  
                    'notes.$[note].category': content,
                },
            },
            { 
                arrayFilters: [{ 'note._id': new mongoose.Types.ObjectId(noteId) }],
                new: true,       
                runValidators: true 
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser.notes)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

NoteRouter.delete('/deleteNote/:userId/:noteId', async (req, res) => {
    try {
      const { userId, noteId } = req.params;
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { notes: { _id: noteId } } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser.notes);
    } catch (error) {
      console.error("Error deleting note:", error); // Log the error for debugging
      res.status(500).json({ message: 'Error deleting note: ' + error });
    }
})

export default NoteRouter