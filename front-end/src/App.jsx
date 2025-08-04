import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './features/home/index.jsx'
import * as Components from './components/index.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Components.Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
