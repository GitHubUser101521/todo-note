import { } from 'react'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className='flex items-center justify-center min-h-screen flex-col text-center'>
      
      <h1 className="text-6xl font-bold mb-4">TodoNote</h1>
      <p className="text-gray-600 text-lg mb-8">Make it your way.</p>

      <div className='flex space-x-4'>
        <Link to='/login'>
          <button className='primary-btn'>Login</button>
        </Link>

        <Link to='/signup'>
          <button className='primary-btn'>Sign up</button>
        </Link>
      </div>
    </div>
  )
}

export default Landing
