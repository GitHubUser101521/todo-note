import {} from 'react'
import { NavLink } from 'react-router-dom'
import Profile from '../Profile'

function Notes() {
return (
    <div className='flex h-screen'>
        <div className='w-full p-20'>
            <h1 className='text-4xl font-bold'>Notes</h1>
            <button className='text-blue-950 my-3'> + Add note</button>

            <hr className='mb-3'/>
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

export default Notes
