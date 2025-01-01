import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, Signup, Landing, ErrorElement, Todolist, Notes, Settings } from './Components'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorElement />
  },
  {
    path: '/todolist',
    element: <Todolist />,
    errorElement: <ErrorElement />
  },
  {
    path: '/notes',
    element: <Notes />,
    errorElement: <ErrorElement />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorElement />
  }, 
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorElement />
  }, 
  {
    path: '/settings',
    element: <Settings />,
    errorElement: <ErrorElement />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
