import { useRef } from 'react'
import { useAccountStore } from '../Utils/AccountStore';
import PopupBackground from './PopupBackground'

function Search() {
  const searchInput = useRef(null)
      
  return (
    <>
      <PopupBackground />
      <div className="popup h-60">
        <div className='flex justify-between'>
            <input 
                type="text" 
                ref={searchInput}
                placeholder='Search...'
                className='mb-4'
            />
        </div>

        <hr />

      </div>
    </>
  )
}

export default Search
