import { BrowserRouter, Route, Routes } from 'react-router-dom'
import * as Pages from './features/index.jsx'
import * as Components from './components/index.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Components.Navbar />
        <Routes>
          <Route path="/" element={<Pages.Home />} />
          <Route path="/registrar" element={<Pages.Register />} />
          <Route path="/recuperar-senha" element={<Pages.RecoverPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
