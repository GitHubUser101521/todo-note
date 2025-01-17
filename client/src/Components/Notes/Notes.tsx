import { useNavigate } from 'react-router-dom'
import NotePreview from './NotePreview'

import { NoteType, useAccountStore, useNoteStore } from '../../Utils/Utils'
import SideBar from '../SideBar'

function Notes() {
    const { accountInfos, setAccountInfos } = useAccountStore()
    const { setCurrentNote } = useNoteStore()
    const { _id, notes } = accountInfos
    const navigate = useNavigate()

    const addNote = async () => {
        const defaultNote: NoteType = {
            _id: '',
            title: 'No title',
            createdAt: Date.now().toString(),
            content: ''
        }

        const response = await fetch(`http://localhost:3000/createNote/${_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultNote),
        })

        const newNote = await response.json()

        if (response.ok) {
            const newAccountState = {
                ...accountInfos, notes: [ ...accountInfos.notes, newNote]
            }

            setAccountInfos(newAccountState)
            setCurrentNote(newNote)
            navigate(`/notes/${newNote._id}`)
        } else {
            console.log('no')
        }
    }

return (
    <div className='flex h-screen'>
        <div className='flex flex-col p-20 pb-8 w-4/5 mx-auto'>
            <>
                <h1 className='text-5xl font-bold'>Notes</h1>
                <div className='flex justify-between h-min py-2 text-lg'>
                    <button 
                        className='text-blue-950'
                        onClick={addNote}
                    > + Add note</button>
                </div>

                <hr className='mb-3'/>
            </>

            <div className='grid grid-cols-3 gap-4 mt-4 overflow-y-scroll'>
                {
                    notes.length > 0 ? 
                        notes.map((note) => (
                            <NotePreview key={note._id} { ...note }/>
                        ))
                        :
                        <p>Note is empty!</p>
                }
            </div>
        </div>

        <SideBar />
    </div>
)
}

export default Notes
