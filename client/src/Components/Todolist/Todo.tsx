import { TodoType, useAccountStore, useTodoStore } from '../../Utils/Utils'
import { FaTrash } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";

function Todo(todo: TodoType) {
    const { accountInfos, setAccountInfos } = useAccountStore()
    const { setIsEditOpen, setCurrentTodo } = useTodoStore()

    const handleDeleteTask = async (todo: TodoType) => {
        const response = await fetch(`http://localhost:3000/deleteTodo/${accountInfos._id}/${todo._id}`, {
            method: 'DELETE', 
        })

        const data = await response.json()

        if (!response.ok) {
           alert('An error has occured') 
        } else {
            setAccountInfos({ ...accountInfos, todos: data })
        }
    }

    const handleCompleteTask = async (todo: TodoType) => {
        const updatedTodo = {
            ...todo,
            completed: !todo.completed
        }
    
        const response = await fetch(`http://localhost:3000/editTodo/${accountInfos._id}/${todo._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo),
        })
    
        if (!response.ok) {
            const errorData = await response.json(); // Get error message from server
            console.log(`Error: ${errorData.message || 'Failed to add task'}`);
            return; // Stop execution on error
        }
    
        const newAccountState = { 
            ...accountInfos, 
            todos: accountInfos.todos.map((t) =>
                t._id === todo._id ? { ...todo, ...updatedTodo } : t
            )
        }

        setAccountInfos(newAccountState);
    }
    
  return (
    <div key={todo._id} className={`todolist ${todo.color} cursor-pointer`}>
        <div 
            className='flex gap-4 items-center'
            onDoubleClick={() => handleCompleteTask(todo)}
        >

            <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => handleCompleteTask(todo)}
            />

            <span className={todo.completed ? 'line-through' : ''}>
                {todo.task} 
                {todo.desc ? 
                    <span className='text-gray-400'> &nbsp;{todo.desc}</span>
                    :
                    ''
                }
            </span>
                                    
        </div>

        <div className='flex gap-6'>
            <button 
                onClick={() => {
                    setIsEditOpen(true)
                    setCurrentTodo(todo)
                }}
                className='hover-icons'
            >
                <MdEditSquare />
            </button>

            <button 
                onClick={() => handleDeleteTask(todo)}
                className='hover-icons'
            >
                <FaTrash />
            </button>
        </div>
    </div>
  )
}

export default Todo
