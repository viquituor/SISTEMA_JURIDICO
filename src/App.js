import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAdv from './pages/CadastroAdv';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastroadv" element={<CadastroAdv />} />
      </Routes>
    </Router>
  );
}
export default App;
