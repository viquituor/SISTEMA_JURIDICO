import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/contratos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Contratos = () => {
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [contratos, setContratos] = useState([]);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    
    
    
    useEffect(() => {
        const carregarContratos = async () => {
            try {
                console.log("OAB no frontend:", oab);
                const response = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos`);
                console.log('Dados recebidos front:', response.data); // Adicione este log
                setContratos(response.data);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error.response?.data || error.message);
                // Adicione feedback visual para o usuário
            }
        };
        carregarContratos();
    }, [oab]);
    
      const contratosFiltrados = contratos.filter(contrato =>
        contrato.nome_cliente.toLowerCase().includes(busca.toLowerCase())
      );

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-contrato">
            <div className="buscar-add">
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="input-busca"
                    />
                    <button>ADICIONAR</button>
                </div>
                <div className="tabela-contrato">
                    <table>
                      <thead><tr><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratosFiltrados.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {setMostrarInfo(true) ;setContratoSelecionado(contrato)}}>
                                <td>{contrato.nome_cliente}</td>
                                <td>{contrato.status_contrato}</td>
                                <td>{contrato.tipo_servico}</td>
                                <td>{contrato.data_inicio}</td>
                                <td>{contrato.valor}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {mostrarInfo && contratoSelecionado && (
                        <div className="aba">
                            <h3>INFORMAÇÕES DO CONTRATO <span onClick={() => setMostrarInfo(false)}>&times;</span></h3>
                            <div className="info-contrato">
                                <h4>Nome do Cliente: {contratoSelecionado.nome_cliente}</h4>
                                <p>CPF: {contratoSelecionado.CPF}</p>
                                <h4>ADVOGADO: {contratoSelecionado.nome_advogado}</h4>
                                <p>OAB: {contratoSelecionado.OAB}</p>
                                <p>Status: {contratoSelecionado.status_contrato}</p>
                                <p>Tipo de Serviço: {contratoSelecionado.tipo_servico}</p>
                                <p>Data de Início: {contratoSelecionado.data_inicio}</p>
                                <p>Valor: {contratoSelecionado.valor}</p>
                                <p>Descrição: {contratoSelecionado.descricao}</p>

                            </div>
                        </div>
                    )}
                </div>



                
            </main>
        </div>
    );
};

export default Contratos;