import React, {  useEffect } from "react";
//import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Clientes = () => {
    const { oab } = useParams();
    
    const navigate = useNavigate();


// Função para carregar dados
useEffect(() => {})

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda">AGENDA</button>
                    <button className="contratos">CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`advogados/${oab}/Clientes`)}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-Clientes">
                
            </main>
        </div>
    );
};

export default Clientes;