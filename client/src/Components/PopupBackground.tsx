import { useTodoStore, useAccountStore, useNoteStore } from "../Utils/Utils.ts"
import { useEffect } from 'react'

function PopupBackground() {
    const { setIsCreateOpen, setIsEditOpen, setIsCategoryFormOpen } = useTodoStore()
    const { setIsSearching } = useAccountStore()
    const { setIsNoteCategoryFormOpen } = useNoteStore()

    useEffect(() => {
      document.addEventListener('keydown', (event) => {
          if (event.key === "Escape" || event.key === "Esc") { 
            setIsCreateOpen(false)
            setIsEditOpen(false)
            setIsCategoryFormOpen(false)
            setIsSearching(false)
            setIsNoteCategoryFormOpen(false)
          }
      });
    })

    const closeAll = () => {
        setIsCreateOpen(false)
        setIsEditOpen(false)
        setIsCategoryFormOpen(false)
        setIsSearching(false)
        setIsNoteCategoryFormOpen(false)
    }

  return (
    <div className='background'>
        <button 
            className="w-10 bg-white aspect-square rounded-full absolute right-8 top-8 font-bold opacity-100"
            onClick={() => closeAll()}
        >X</button>
    </div>
  )
}

export default PopupBackground
