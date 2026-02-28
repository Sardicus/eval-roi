import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import ListingsPage from './Components/ListingsPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <div className='grid w-[100%] h-screen place-items-center bg-cyan-400'>
          <Login />
        </div>
      } />
      <Route path="/listings" element={<ListingsPage />} />
    </Routes>
  )
}

export default App