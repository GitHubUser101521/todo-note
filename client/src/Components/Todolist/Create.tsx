import { useRef, useEffect } from 'react'
import { TodoType, useAccountStore, useTodoStore } from '../../Utils/Utils'
import PopupBackground from '../PopupBackground';


function Create() {
    const { todos, _id, colors, categories } = useAccountStore.getState().accountInfos
    const { setAccountInfos, accountInfos } = useAccountStore()
    const firstFieldRef = useRef<HTMLInputElement>(null); 

    const {
        newTodo, setNewTodo, setIsCreateOpen, capitalize
    } = useTodoStore()

    useEffect(() => {
        if (firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, []); 

    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!newTodo.task) {
            return
        }

        const newTodoWithoutId = {
            task: newTodo.task,
            completed: false,
            createdAt: Date.now().toString(),
            desc: newTodo.desc,
            category: newTodo.category,
            color: newTodo.color
        };

        setIsCreateOpen(false)

        const response = await fetch(`http://localhost:3000/createTodo/${_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodoWithoutId),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get error message from server
            console.log(`Error: ${errorData.message || 'Failed to add task'}`);
            return; // Stop execution on error
        }

        const createdTodo: TodoType = await response.json(); // Get the todo WITH _id

        setAccountInfos({ ...accountInfos, todos: [ ...todos, createdTodo ] })
        setNewTodo({ task: '', desc: '', category: 'All', color: 'default' })
    }
    
  return (
    <>
        <PopupBackground />
        <div className="popup">
            <h1 className="text-xl font-bold mb-4">Create new todo:</h1>
            <form onSubmit={handleAddTask}>
                <div className="mb-4">
                    <label className="label">Task</label>
                    <input 
                        type="text" 
                        required 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="Enter your task" 
                        onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value})}
                        value={newTodo.task}
                        ref={firstFieldRef}
                    />
                </div>
                <div className="mb-4">
                    <label className="label">Description <span className="text-gray-500 text-xs">(optional)</span></label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" 
                        placeholder="Enter a description (optional)"
                        onChange={(e) => setNewTodo({ ...newTodo, desc: e.target.value})}
                        value={newTodo.desc}
                    />
                </div>
                <div className='mb-4 flex justify-between items-center'>
                    <div className='flex gap-4'>
                        <label className="block text-gray-700 text-sm font-bold">Category:</label>
                        <select
                            defaultValue='All'
                            onChange={(e) => { setNewTodo({ ...newTodo, category: e.target.value})}}
                        >
                            {
                                categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex gap-4'>
                        <label className="block text-gray-700 text-sm font-bold">Color:</label>
                        <select
                            onChange={(e) => setNewTodo({ ...newTodo, color: e.target.value })}
                        >
                            {
                                colors.map((color) => (
                                    <option key={color} value={color}>{capitalize(color)}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Todo
                    </button>
                </div>
            </form>
        </div>
    </>
  )
}

export default Create
