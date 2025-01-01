import { NavLink } from 'react-router-dom'
import { useAccountStore, TodoType } from '../../AccountStore'
import Profile from '../Profile'

function Todolist() {
    const { name, todos, _id } = useAccountStore.getState().accountInfos
    const { accountInfos, setAccountInfos } = useAccountStore()

    const handleAddTask = async () => {
        const newTask = prompt('New task:');

        if (!newTask) return; 

        try {
            const newTodoWithoutId = {
                task: newTask,
                completed: false,
                createdAt: Date.now(),
            };

            const response = await fetch(`http://localhost:3000/createTodo/${_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodoWithoutId),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error message from server
                alert(`Error: ${errorData.message || 'Failed to add task'}`);
                return; // Stop execution on error
            }

            const createdTodo: TodoType = await response.json(); // Get the todo WITH _id

            setAccountInfos({ ...accountInfos, todos: [ ...todos, createdTodo ] })
        } catch (error) {
            console.error("Error adding task:", error);
            alert('An error occurred while adding the task.');
        }
    }

    const handleDeleteTask = async (todo: TodoType) => {
        const response = await fetch(`http://localhost:3000/deleteTodo/${_id}/${todo._id}`, {
            method: 'DELETE', 
        })

        const data = await response.json()

        if (!response.ok) {
           alert('An error has occured') 
        } else {
            setAccountInfos({ ...accountInfos, todos: data.todos })
        }
    }

    return (
        <div className='flex h-screen'>
            <div className='w-full p-20'>
                <h1 className='text-4xl font-bold'>Todolist for {name}</h1>
                <button onClick={handleAddTask} className='text-blue-950 my-3'> + Add task</button>

                <hr className='mb-3'/>

                {todos ?
                    todos.map((todo) => (
                        <span key={todo._id} className='flex gap-4 items-center h-min justify-between mb-2'>
                            <span className='flex gap-4'>
                                <input type="checkbox" />
                                <span>{todo.task}</span>
                                <span>{todo._id}</span>
                            </span>

                            <button className='bg-red-500 rounded py-1 px-2 text-white hover:bg-red-600' onClick={() => handleDeleteTask(todo)}>Delete</button>
                        </span>
                    ))
                    :
                    <p>All tasks are finished!</p>
                }
            </div>
            
            <div className='border-l-2 w-1/4 bg-gray-100 flex flex-col justify-between p-4'>
                <div className='w-full h-min flex justify-around pb-4'>
                    <NavLink to='/todolist'>
                        <p>Todolist</p>
                    </NavLink>

                    <NavLink to='/notes'>
                        <p>Notes</p>
                    </NavLink>
                </div>

                <hr className='border-b-2'/>

                <div className='mt-4'>
                    njfd
                </div>

                <div className='h-min flex justify-between items-center'>
                    <button>X</button>

                    <Profile />
                </div>
            </div>
        </div>
    )
}

export default Todolist
