import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAdv from './pages/CadastroAdv';
import EditeAdv from './pages/EditeAdv';
import Agenda from './pages/Agenda';
import Clientes from './pages/Clientes';
import Contratos from './pages/Contratos';
import Pagamentos from './pages/pagamentos';
import Processos from  './pages/Processos';
import PrazosProcesso from './pages/PrazosProcesso';
import CONTROL from './pages/CONTROL.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CONTROL/>}/>
        <Route path="/advogados" element={<Login />} />
        <Route path="/cadastroadv" element={<CadastroAdv />} />
        <Route path="/editeadv/:oab" element={<EditeAdv />}/>
        <Route path="/advogados/:oab/Agenda" element={<Agenda/>}/>
        <Route path="/advogados/:oab/Clientes" element={<Clientes/>}/>
        <Route path="/advogados/:oab/Contratos" element={<Contratos/>}/>
        <Route path="/advogados/:oab/Pagamentos" element={<Pagamentos/>} />
        <Route path="/advogados/:oab/Processos" element={<Processos/>} />
        <Route path="/advogados/:oab/Prazos" element={<PrazosProcesso/>}/>
      </Routes>
    </Router>
  );
}
export default App;
