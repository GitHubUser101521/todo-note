import { NavLink } from 'react-router-dom'
import { useAccountStore, TodoType } from '../../Stores/AccountStore'
import Profile from '../Profile'
import CreateTodo from './Create'
import Edit from './Edit'
import { useCreateTodoStore, useEditTodoStore, useTodoCategoryStore } from '../../Stores/TodoStore'
import { useEffect, useState, ChangeEvent  } from 'react'
import CategoryForm from './CategoryForm'

function Todolist() {
    const { isCreateOpen, setIsCreateOpen } = useCreateTodoStore()
    const { isEditOpen, setIsEditOpen, setCurrentTodo } = useEditTodoStore()
    const { todos, _id, categories } = useAccountStore.getState().accountInfos
    const { accountInfos, setAccountInfos } = useAccountStore()
    const [ currentCategory, setCurrentCategory ] = useState('all')
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(true)
    const { isCategoryFormOpen, setIsCategoryFormOpen } = useTodoCategoryStore()

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') { 
              setIsCreateOpen(false)
              setIsEditOpen(false)
              setIsCategoryFormOpen(false)
            }
        });
    })

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

    const handleCompleteTask = async (todo: TodoType) => {
        const updatedTodo = {
            ...todo,
            completed: !todo.completed
        }

        const response = await fetch(`http://localhost:3000/editTodo/${_id}/${todo._id}`, {
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

    const handleChangeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'add') {
            setIsCategoryFormOpen(true)
            e.target.value = 'All'
        } else {
            setCurrentCategory(e.target.value)
        }
    }

    const completedTasks = todos.filter(t => t.completed === true && (currentCategory === 'all' ? true : t.category === currentCategory))
    const uncompletedTasks = todos.filter(t => t.completed === false && (currentCategory === 'all' ? true : t.category === currentCategory))

    return (
        <div className='flex'>
            <div className='flex h-screen w-4/5 mx-auto'>
                <div className='w-full p-20'>
                    <h1 className='text-5xl font-bold'>Todolist</h1>
                    <div className='flex justify-between h-min py-2 text-lg'>
                        <button onClick={() => setIsCreateOpen(true)} className='text-blue-950'> + Add task</button>

                        <select 
                            className='border rounded-md shadow-sm text-center'
                            onChange={(e) => handleChangeCategory(e)}
                        >
                            {
                                categories.todos.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))
                            }
                            <option value='add'>+ Add category</option>
                        </select>
                    </div>

                    <hr className='mb-3'/>

                    {uncompletedTasks.length >= 1 ?
                        uncompletedTasks.map((todo) => (
                            <div key={todo._id} className={`todolist ${todo.color} cursor-pointer`}>
                                <div className='flex gap-4 items-center'
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

                                <div className='flex gap-4'>
                                    <button 
                                        onClick={() => {
                                            setIsEditOpen(true)
                                            setCurrentTodo(todo)
                                        }}
                                        className='hover-icons'
                                    >E</button>
                                    <button 
                                        onClick={() => handleDeleteTask(todo)}
                                        className='hover-icons'
                                    >D</button>
                                </div>
                            </div>
                        ))
                        :
                        <p>No task left!</p>
                    }

                    {completedTasks.length >= 1 ?
                        <>
                            <h1 className='text-2xl font-bold opacity-60 mt-12'>Completed Tasks</h1>
                            <hr className='my-3'/>

                            {completedTasks.map((todo) => (
                                <div key={todo._id} className={`todolist opacity-65 ${todo.color}`}
                                    onDoubleClick={() => handleCompleteTask(todo)}
                                >
                                    <div className='flex gap-4 items-center'>
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

                                    <div className='flex gap-4'>
                                        <button 
                                            onClick={() => {
                                                setIsEditOpen(true)
                                                setCurrentTodo(todo)
                                            }}
                                            className='hover-icons'
                                        >E</button>
                                        <button 
                                            onClick={() => handleDeleteTask(todo)}
                                            className='hover-icons'
                                        >D</button>
                                    </div>
                                </div>
                            ))}
                        </>
                        :
                        <></>
                    }
                </div>

                {isCreateOpen && <CreateTodo />}
                {isEditOpen && <Edit />}
                {isCategoryFormOpen && <CategoryForm />}
            </div>

            {isSidebarOpen && 
                <div className='border-l-2 w-1/5 bg-gray-100 flex flex-col justify-between p-4'>
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
                        <button onClick={() => setIsSidebarOpen(false)}>X</button>

                        <Profile />
                    </div>
                </div>
            }

            {
                !isSidebarOpen && 
                    <div 
                        className='text-4xl cursor-pointer absolute bottom-8 right-8'
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        O
                    </div>
            }
        </div>
    )
}

export default Todolist
