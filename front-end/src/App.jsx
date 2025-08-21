import { BrowserRouter, Route, Routes } from 'react-router-dom'
import * as Pages from './features/index.jsx'
import * as Components from './components/index.jsx'
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Components.Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Pages.Home />} />
          <Route path="/registrar" element={<Pages.Register />} />
          <Route element={<Components.PublicRouteLayout />}>
            <Route path="/recuperar-senha" element={<Pages.RecoverPassword />} />
          </Route>
          <Route element={<Components.PrivateRouteLayout />}>
            <Route path="/alterar-senha" element={<Pages.ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
