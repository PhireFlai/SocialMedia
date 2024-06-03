import React from 'react'
import { Routes, Route, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import Home from './containers/Home';
// @ts-ignore
import Login from './components/Login';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />

      </Routes>
    </Router>
  )
}

export default App
