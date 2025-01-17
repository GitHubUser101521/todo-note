import { useNavigate } from 'react-router-dom'
import { useNoteStore } from '../../Utils/NoteStore'
import { NoteType, useAccountStore } from '../../Utils/AccountStore'
import { FaTrash } from "react-icons/fa";

function NotePreview({ _id, title, createdAt, content }: NoteType) {
    const { accountInfos, setAccountInfos } = useAccountStore()
    const { setCurrentNote, convertToDate } = useNoteStore()
    const navigate = useNavigate()

    const handleNoteNavigation = async () => {
        try {
            const response = await fetch(`http://localhost:3000/getNote/${accountInfos._id}/${_id}`);
    
            if (!response.ok) {
                const errorData = await response.json(); 
                console.error("Error fetching note:", errorData.message || response.statusText); 
                navigate('/notes');
                return; 
            }
    
            const fetchedNote: NoteType = await response.json();
            setCurrentNote(fetchedNote);
            navigate(`/notes/${fetchedNote._id}`)
        } catch (error) {
            console.error("Error in handleNoteNavigation:", error);
            navigate('/notes');
        }
    };

    const handleNoteDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()

        try {
          const response = await fetch(`http://localhost:3000/deleteNote/${accountInfos._id}/${_id}`, {
            method: 'DELETE',
          })

          const updatedNote = await response.json()

          if (response.ok) {
            console.log(updatedNote)
            setAccountInfos({ ...accountInfos, notes: updatedNote})
            return
          }

          console.log('Error deleting note')
        } catch (error) {
          console.error("Error in handleNoteDelete:", error);
        }
    }

    const contentDisplay = () => {
      if (content.length === 0) {
        return <span className='opacity-50'>No content</span>
      } else if (content.length >= 110) {
        return content.slice(0, 110) + '...'
      } else {
        return content.slice(0, 110)
      }
    }
    
  return (
    <div onClick={handleNoteNavigation} className='note-preview border-2'>
      <p className='font-bold text-xl'>{ title }</p>
      <p 
        className='text-xs text-gray-700'
      >
        { convertToDate(createdAt) }
      </p>

      <br />

      <p className='break-words'>{ contentDisplay() }</p>

      <button 
        className='bg-red-500 w-6 h-6 rounded-full place-items-center mr-2 hover:brightness-75 hover-icons absolute top-8 right-6'
        onClick={(e) => handleNoteDelete(e)}
      >
        <FaTrash />
      </button>
    </div>
  )
}

export default NotePreview
