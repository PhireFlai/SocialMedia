import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Search, Feed, CreatePin, PinInfo, NavBar } from "../components";

const Pins = ({user}) => {

  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>

        <div className="h-full">
          <Routes>
          <Route path='/' element={<Feed />} /> 
          <Route path='/category/:categoryId' element={<Feed />} /> 
          <Route path='/pin-info/:pinId' element={<PinInfo user={user} />} /> 
          <Route path='/create-pin' element={<CreatePin user={user}/>} /> 
          <Route path='/Search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>} /> 

          </Routes>
        </div>
      </div>
      
    </div>
  )
}

export default Pins
