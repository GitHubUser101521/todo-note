import { useAccountStore } from '../Utils/Utils'
import { Profile, Apps } from '../Components'
import Search from './Search'

function SideBar() {
  const { isSideBarOpen, setIsSideBarOpen, 
          accountInfos, 
          isSearching, setIsSearching } = useAccountStore()

  return (
    <>
      {isSideBarOpen ? 
        <div className='border-l-2 w-1/5 bg-gray-100 flex flex-col justify-between'>
            <div>
              <div className='border-b-2 flex justify-center'>
                <input 
                  type="text" 
                  placeholder='Search...'
                  className='m-4 px-4 py-2 rounded-full w-full border-2 outline-none'
                  readOnly
                  onClick={() => setIsSearching(true)}
                />
              </div>
              
              <Apps />
            </div>

            <div className='flex justify-between p-4'>
              <img 
                src="/open-icon.png" 
                alt="X" className='w-12'
                onClick={() => setIsSideBarOpen(false)}
              />

              <div className='flex gap-4 items-center'>
                <p>{ accountInfos.name }</p>
                <Profile />
              </div>
            </div>
        </div>
        :
        <div 
          className='text-4xl cursor-pointer absolute bottom-4 right-8'
          onClick={() => setIsSideBarOpen(true)}
        >
          <img 
            src="/open-icon.png" 
            alt="O" 
            className='w-12'
          />
        </div>
        }

        {
          isSearching && <Search />
        }
    </>
  )
}

export default SideBar
