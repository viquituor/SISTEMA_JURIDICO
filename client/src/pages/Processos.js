import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/processos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';


const Processos = () => {

    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [processos, setProcessos] = useState([]);


    useEffect (()=> {

        const carregarProcessos = async () => {
            try {
            const response = await axios.get(`http://localhost:3001/advogados/${oab}/Processos`)
            setProcessos(response.data);

        } catch (error) {
            alert('erro ao buscar processos', error);
            throw error;
        }
        }
    carregarProcessos();
},[oab]);

const processosFiltrados = processos.filter(processo =>
        processo.nome.toLowerCase().includes(busca.toLowerCase()) ||
        processo.status_contrato.toLowerCase().includes(busca.toLowerCase()) ||
        processo.tipo_servico.toLowerCase().includes(busca.toLowerCase()) ||
        processo.num_processo.toString().includes(busca.toLowerCase())||
        processo.CPF.toString().includes(busca.toLowerCase())
        );











return (

    <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processosAtv" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-pross">
            <div className="buscar-add">
                    <input
                        name="input-busca"
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        
                    />
                    <button>PRAZOS DE PROCESSOS</button>
                    <button>ADICIONAR</button>
                </div>

                    <table className="table-pross">
                    <thead>
                        <tr>
                            <th>cod de contrato</th><th>nome</th><th>CPF</th><th>tipo de serviço</th><th>numero do processo</th><th>status do processo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processosFiltrados.map((processo)=>(                       
                             <tr key={processo.num_processo}>
                            <td>{processo.cod_contrato}</td><td>{processo.nome}</td><td>{processo.CPF}</td><td>{processo.tipo_servico}</td><td>{processo.num_processo}</td><td>{processo.status_processo}</td>
                            </tr>
                        ))}
                    </tbody>

                    </table>

            </main>
        </div>

    );
};

export default Processos;





