import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
});

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
    todos: [TodoSchema]
})

const UserModel = mongoose.model('user', UserSchema, 'users')
export default UserModel