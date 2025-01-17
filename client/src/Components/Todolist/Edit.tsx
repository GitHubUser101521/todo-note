import { useRef, useEffect } from 'react'
import { useAccountStore, useTodoStore } from '../../Utils/Utils'
import PopupBackground from '../PopupBackground';


function Edit() {
    const { setAccountInfos, accountInfos } = useAccountStore()
    const { _id, colors, categories } = accountInfos
    const firstFieldRef = useRef<HTMLInputElement>(null); 

    const {
        setIsEditOpen, currentTodo, setCurrentTodo, capitalize
    } = useTodoStore()

    useEffect(() => {
        if (firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, []); 

    const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const updatedTodo = {
            _id: currentTodo._id,
            task: currentTodo.task,
            completed: currentTodo.completed,
            createdAt: currentTodo.createdAt,
            desc: currentTodo.desc, 
            category: currentTodo.category,
            color: currentTodo.color
        };

        setIsEditOpen(false)

        const response = await fetch(`http://localhost:3000/editTodo/${_id}/${currentTodo._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get error message from server
            console.log(`Error: ${errorData.message || 'Failed to add task'}`);
            return; // Stop execution on error
        }

        const newAccountState = { 
            ...accountInfos, 
            todos: accountInfos.todos.map((todo) =>
                todo._id === currentTodo._id ? { ...todo, ...updatedTodo } : todo
            )
        }

        setAccountInfos(newAccountState);

        setCurrentTodo({
            task: '',
            completed: false,
            createdAt: '',
            _id: '',
            desc: '',
            category: '',
            color: ''
        })
    }
    
  return (
    <>
        <PopupBackground />
        <div className="popup">
            <h1 className="text-xl font-bold mb-4">Edit todo:</h1>
            <form onSubmit={handleEditTask}>
                <div className="mb-4">
                    <label className="label">Task</label>
                    <input 
                        type="text" 
                        required 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="Enter your task" 
                        onChange={(e) => setCurrentTodo({ ...currentTodo, task: e.target.value})}
                        value={currentTodo.task}
                        ref={firstFieldRef}
                    />
                </div>
                <div className="mb-4">
                    <label className="label">Description <span className="text-gray-500 text-xs">(optional)</span></label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" 
                        placeholder="Enter a description (optional)"
                        onChange={(e) => setCurrentTodo({ ...currentTodo, desc: e.target.value})}
                        value={currentTodo.desc}
                    />
                </div>
                <div className="mb-4 flex gap-4 items-center">
                    <label className="label">Completed:</label>
                    <input
                        type="checkbox"
                        checked={currentTodo.completed} 
                        onChange={() => setCurrentTodo({ ...currentTodo, completed: !currentTodo.completed })}
                    />
                </div>
                <div className='mb-4 flex justify-between items-center'>
                    <div className='flex gap-4'>
                        <label className="block text-gray-700 text-sm font-bold">Category:</label>
                        <select
                            defaultValue='All'
                            onChange={(e) => { setCurrentTodo({ ...currentTodo, category: e.target.value})}}
                        >
                            {
                                categories.todos.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex gap-4'>
                        <label className="block text-gray-700 text-sm font-bold">Color:</label>
                        <select
                            onChange={(e) => setCurrentTodo({ ...currentTodo, color: e.target.value })}
                            defaultValue={currentTodo.color}
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
                        Edit Todo
                    </button>
                </div>
            </form>
        </div>
    </>
  )
}

export default Edit