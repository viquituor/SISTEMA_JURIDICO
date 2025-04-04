import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAdv from './pages/CadastroAdv';
import EditeAdv from './pages/EditeAdv';
import Agenda from './pages/Agenda';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastroadv" element={<CadastroAdv />} />
        <Route path="/editeadv/:oab" element={<EditeAdv />}/>
        <Route path="/Agenda/:oab" element={<Agenda/>}/>
      </Routes>
    </Router>
  );
}
export default App;
