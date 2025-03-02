import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
    desc: String,
    createdAt: String,
    category: {
        type: [String],
        default: ['All']
    },
    color: String
});

export const NoteSchema = new mongoose.Schema({
    title: String,
    createdAt: String,
    content: String,
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true,     
        minlength: 3,   
        maxlength: 15
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    todos: [TodoSchema],
    notes: [NoteSchema],
    categories: {
        type: [String],
        default: ['All']
    },
    colors: {
        type: [String],
        default: ['default', 'red', 'yellow', 'green', 'blue', 'purple']
    }
})

const UserModel = mongoose.model('user', UserSchema, 'users')
export default UserModel