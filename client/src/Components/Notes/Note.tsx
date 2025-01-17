import { useNoteStore } from '../../Utils/NoteStore'
import { useAccountStore } from '../../Utils/AccountStore'
import { NavLink } from 'react-router-dom'

function Create() {
  const { currentNote, setCurrentNote, convertToDate } = useNoteStore()
  const { accountInfos, setAccountInfos } = useAccountStore()
  const { _id, title, createdAt, content } = currentNote

  const handleChangeContent = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote({ ...currentNote, content: e.target.value})
  }

  const handleChangeTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNote({ ...currentNote, title: e.target.value})
  }

  const handleConfirmChange = async () => {    
    try {
      const response = await fetch(`http://localhost:3000/editNote/${accountInfos._id}/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentNote),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update note");
      }
  
      const updatedNotes = await response.json();
  
      if (updatedNotes) {
        setAccountInfos({ ...accountInfos, notes: updatedNotes});
      } else {
        console.error("No updatedNote received in response");
      }
  
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className='w-full h-screen'>
      <div className='flex items-center gap-4 p-8 sticky top-0 bg-slate-50'>
        <div>
          <NavLink to='/notes'>Notes</NavLink>
        </div>

        <div>
          <input 
            className='text-xl font-bold mb-2 w-56 pl-2 bg-slate-50'
            value={title}
            onChange={(e) => handleChangeTitle(e)}
            onBlur={handleConfirmChange}
            spellCheck={false}
          />
          <p className='text-xs pl-2'>{ convertToDate(createdAt) }</p>
        </div>
      </div>
      
      <div className='flex justify-center'>
        <textarea 
          className='note' 
          value={content}
          onChange={(e) => handleChangeContent(e)}
          onBlur={handleConfirmChange}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default Create
