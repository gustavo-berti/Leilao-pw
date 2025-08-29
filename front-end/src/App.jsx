import { BrowserRouter, Route, Routes } from 'react-router-dom'
import * as Pages from './features/index.jsx'
import * as Layouts from './routes/index.jsx'
import * as Components from './components/index.jsx'
import { useEffect, useState } from 'react';
import AuthService from './services/authService.js';

function App() {
  const authService = new AuthService();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      authService.validateToken(JSON.parse(storedUser)).then(response => {
        if (response) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem('user');
          setUser(null);
          alert('Sua sessão expirou. Por favor, faça login novamente.');
        }
      });
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Components.Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Pages.Home />} />
          <Route path="/registrar" element={<Pages.Register />} />
          <Route element={<Layouts.PublicRoute />}>
            <Route path="/recuperar-senha" element={<Pages.RecoverPassword />} />
          </Route>
          <Route element={<Layouts.PrivateRoute />}>
            <Route path="/alterar-senha" element={<Pages.ChangePassword />} />
          </Route>
          <Route element={<Layouts.PrivateRoute />}>
            <Route path="/admin" element={<Pages.Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
