import { NavLink } from 'react-router-dom'

const apps = ['todolist', 'notes']

const capitalize = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

function Apps() {
  return (
    <div className='flex flex-col items-end p-4'>
      <p className='font-bold text-xl text-gray-700'>Apps</p>

      <br />

      {
        apps.map(app => (
            <NavLink to={`/${app}`} key={app}>
                <div className='text-xl'>
                    { capitalize(app) }
                </div>
            </NavLink>
        ))
      }
    </div>
  )
}

export default Apps
