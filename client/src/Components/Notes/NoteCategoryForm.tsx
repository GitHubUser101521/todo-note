import { useRef, useEffect, useState } from 'react'
import { useAccountStore } from '../../Utils/Utils';
import PopupBackground from '../PopupBackground'

function CategoryForm() {
    const { addNoteCategory, deleteNoteCategory, accountInfos } = useAccountStore()
    const { categories, _id } = accountInfos
    const [ error, setError ] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []); 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (categories.notes.length > 12) {
            setError('You cannot have more than 12 categories')
            return
        }

        const newCategory = inputRef.current?.value || ''

        if (!newCategory || newCategory.length > 12) {
            setError('New category mush be atleast 1 character and less than 12')
            return
        }

        const check = categories.notes.includes(newCategory)

        if (check) {
            setError(`${newCategory} is already a category`)
            return
        }

        const response = await fetch(`http://localhost:3000/addCategory/notes/${_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryName: newCategory }),
        })

        const data = await response.json()

        if(response.ok) {
            setError('')
            addNoteCategory(newCategory)
            if (inputRef.current) {
                inputRef.current.value = ''
            }
        } else {
            console.log(data.message)
        }
    }

    const handleDeleteCategory = async (c: string) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteCategory/notes/${_id}/${c}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setError('')
                deleteNoteCategory(c)
            } else {
                console.log('Response not ok :(')
            }
        } catch (error) {
            console.log(error)
        }
    }

    
  return (
    <>
        <PopupBackground />
        <form onSubmit={(e) => handleSubmit(e)} className='popup'>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">New Category</label>
                <div className='flex gap-1'>
                    <input 
                        type="text"  
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="Enter new category" 
                        ref={inputRef}
                    />
                    <button 
                        className='bg-blue-600 text-white rounded py-1 px-6'
                        type='submit'
                    >
                        Add
                    </button>
                </div>

                { error && <p className="text-red-600 text-xs">{ error }</p>}
            </div>

            <div className="mb-4 h-fit">
                <label className='block text-gray-700 text-sm font-bold mb-2'>Your Categories</label>
                <div className='flex flex-wrap gap-2'>
                    <span className='bg-slate-200 rounded-full px-6 gap-3 h-10 flex items-center'>
                        All
                    </span>
                    {
                        categories.notes.filter(cat => cat !== 'All').map((c) => (
                            <span key={c} className='bg-slate-200 rounded-full px-3 gap-3 h-10 flex items-center'>
                                {c} 
                                <button 
                                    type="button"
                                    className='cursor-pointer hover:font-bold rounded-full'
                                    onClick={() => {handleDeleteCategory(c)}}
                                >
                                    x
                                </button>
                            </span>
                        ))
                    }
                </div>
            </div>

            <p className='text-xs text-gray-700'>Esc to close</p>
        </form>
    </>
  )
}

export default CategoryForm
