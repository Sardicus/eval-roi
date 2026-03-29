import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import ListingsPage from './Components/ListingsPage'
import AddListingPage from './Components/AddListingPage'
import EditListingPage from './Components/EditListingPage'
import ListingDetailPage from './Components/ListingDetailPage'
import ProtectedRoute from './Components/ProtectedRoute'
import ProfilesPage from './Components/ProfilesPage'
import Navbar from './Components/Navbar'
import FraudCheckPage from './Components/FraudCheckPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <Login />
      } />
      <Route path="/listings" element={
        <ProtectedRoute>
          <><Navbar /><ListingsPage /></>
        </ProtectedRoute>
      } />
      <Route path="/add-listing" element={
        <ProtectedRoute>
          <><Navbar /><AddListingPage /></>
        </ProtectedRoute>
      } />
      <Route path="/edit-listing/:id" element={
        <ProtectedRoute>
          <><Navbar /><EditListingPage /></>
        </ProtectedRoute>
      } />
      <Route path="/listing/:id" element={
        <ProtectedRoute>
          <><Navbar /><ListingDetailPage /></>
        </ProtectedRoute>
      } />
      <Route path="/profiles" element={
        <ProtectedRoute>
          <><Navbar /><ProfilesPage /></>
        </ProtectedRoute>
      } />
       <Route path="/fraud-check" element={
        <ProtectedRoute>
          <><Navbar /><FraudCheckPage /></>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App