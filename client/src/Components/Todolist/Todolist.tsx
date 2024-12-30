import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAccountStore, TodoType } from '../../AccountStore'

function Todolist() {
    const navigate = useNavigate()
    const { name, todos, _id } = useAccountStore.getState().accountInfos
    const { createTodo } = useAccountStore()

    useEffect(() => {
        if (name === '') {
            navigate('/login')
        } 
    }, [])

    const handleAddTask = async () => {
        const newTask = prompt('New task:')

        if (newTask === '') {
            return
        }

        try {
            const newTodo: TodoType = {
                task: newTask || '',
                completed: false
            }

            console.log(name, todos, _id)

            const response = await fetch(`http://localhost:3000/createTodo/${_id}`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo),
            })
    
            const data = await response.json()

            if (response.ok) {    
                createTodo(newTodo)
            } else {
                alert('Error:' + data.message)
            }
        } catch (error) {
            console.log(error)
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
                        <div key={todo.task} className='flex gap-4 h-min'>
                            <input type="checkbox" />
                            <p>{todo.task}</p>
                        </div>
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

                    <div className='profile-picture'>{name[0]}</div>
                </div>
            </div>
        </div>
    )
}

export default Todolist
