import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAdv from './pages/CadastroAdv';
import EditeAdv from './pages/EditeAdv';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastroadv" element={<CadastroAdv />} />
        <Route path="/editeadv/:oab" element={<EditeAdv />}/>
      </Routes>
    </Router>
  );
}
export default App;
