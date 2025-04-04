import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useNavigate} from 'react-router-dom';

const Agenda = () => {

    const [busca, setBusca] = useState("");

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" to='/'>AGENDA</button>
                    <button className="contratos" to='/'>CONTRATOS</button>
                    <button className="processos" to='/'>PROCESSOS</button>
                    <button className="pagamentos" to='/'>PAGAMENTOS</button>
                    <button className="clientes" to='/'>CLIENTES</button>
                </nav>
            </header>

            <main >
                <div className="buscar-add">
                    <input name="BUSCAR" placeholder="BUSCAR" value={busca} onChange={(e) => setBusca(e.target.value)} />
                    <button to="/cadastroadv">ADICIONAR</button>
                </div>
                <div className="cont-agenda">
                    <div className="compromissos">
                        <h1>12 - janeira</h1>
                        <p>audiencias <br/> patrick estrela</p>
                        
                    </div>
                </div>
            </main>

            <footer className="footer-principal">
                <p>&copy; 2023 Advocacia Almeida. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Agenda;