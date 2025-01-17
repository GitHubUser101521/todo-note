import {} from 'react'
import { useAccountStore } from '../Utils/AccountStore'
import { Link } from 'react-router-dom'

function Profile() {
    const name = useAccountStore.getState().accountInfos.name
  return (
    <div>
        <Link to='/settings'>
            <div className='profile-picture'>{name[0]}</div>
        </Link>
    </div>
  )
}

export default Profile
