import React from 'react'
import { Link } from 'react-router-dom'

function ErrorElement() {
  return (
    <div>
      ErrorElement
      <Link to='/'>
        <button>Back</button>
      </Link>
    </div>
  )
}

export default ErrorElement
