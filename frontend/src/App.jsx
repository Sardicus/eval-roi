import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import ListingsPage from './Components/ListingsPage'
import AddListingPage from './Components/AddListingPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <div className='grid w-[100%] h-screen place-items-center bg-cyan-400'>
          <Login />
        </div>
      } />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/add-listing" element={<AddListingPage />} />
    </Routes>
  )
}

export default App