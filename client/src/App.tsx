import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Room from './pages/Room'

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path='/'>
        <Route index path='' element={<Home />} />
        <Route path= '/room/:roomId' element={<Room />}/>
      </Route>
    )
  )
  return (
   <>
   <RouterProvider router={router} />
   </>
  )
}

export default App
