import { useAccountStore, useTodoStore } from '../../Utils/Utils'
import { Todo, CreateTodo, Edit, CategoryForm } from './TodolistComponents'
import SideBar from '../SideBar'

function Todolist() {
    const { accountInfos, currentCategory, setCurrentCategory } = useAccountStore()
    const { todos, categories } = accountInfos
    const { 
        isCreateOpen, setIsCreateOpen,
        isEditOpen,
        isCategoryFormOpen, setIsCategoryFormOpen,
    } = useTodoStore()

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'add') {
            setIsCategoryFormOpen(true)
            e.target.value = 'All'
        } else {
            setCurrentCategory(e.target.value)
        }
    } 

    const uncompletedTasks = todos.filter(t => t.completed === false && (currentCategory === 'All' ? true : t.category === currentCategory))
    const completedTasks = todos.filter(t => t.completed === true && (currentCategory === 'All' ? true : t.category === currentCategory))

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

                    <hr className='mb-6'/>

                    {uncompletedTasks.length >= 1 ?
                        uncompletedTasks.map(todo => (
                            <Todo {...todo} key={todo._id}/>
                        ))
                        :
                        <p>No task left!</p>
                    }

                    {completedTasks.length >= 1 ?
                        <>
                            <h1 className='text-2xl font-bold opacity-60 mt-12'>Completed Tasks</h1>
                            <hr className='my-3'/>

                            {
                                completedTasks.map(todo => (
                                    <Todo {...todo} key={todo._id} />
                                ))
                            }
                        </>
                        :
                        <></>
                    }
                </div>

                {isCreateOpen && <CreateTodo />}
                {isEditOpen && <Edit />}
                {isCategoryFormOpen && <CategoryForm />}
            </div>
    
            <SideBar />
        </div>
    )
}

export default Todolist
